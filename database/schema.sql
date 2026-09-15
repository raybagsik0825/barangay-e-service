CREATE DATABASE IF NOT EXISTS barangay_eservices
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE barangay_eservices;

-- ============================================================================
-- 1. USERS, ROLES & AUDIT
-- ============================================================================

CREATE TABLE users (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username    VARCHAR(50)  NOT NULL UNIQUE,
  email       VARCHAR(120) DEFAULT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name   VARCHAR(120) NOT NULL,
  role        VARCHAR(20)  NOT NULL DEFAULT 'staff'
              CHECK (role IN ('admin','staff','lupon','pnp_authorized')),
  status      VARCHAR(20)  NOT NULL DEFAULT 'active'
              CHECK (status IN ('active','inactive','locked')),
  last_login_at DATETIME   DEFAULT NULL,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE permissions (
  id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  role         VARCHAR(20) NOT NULL,
  module       VARCHAR(50) NOT NULL,
  can_create   TINYINT(1)  NOT NULL DEFAULT 0,
  can_read     TINYINT(1)  NOT NULL DEFAULT 1,
  can_update   TINYINT(1)  NOT NULL DEFAULT 0,
  can_delete   TINYINT(1)  NOT NULL DEFAULT 0,
  UNIQUE KEY uq_role_module (role, module)
) ENGINE=InnoDB;

CREATE TABLE activity_logs (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     BIGINT UNSIGNED DEFAULT NULL,
  action      VARCHAR(30)  NOT NULL,
  module      VARCHAR(50)  NOT NULL,
  entity_type VARCHAR(30)  NOT NULL,
  entity_id   BIGINT UNSIGNED DEFAULT NULL,
  details     JSON         DEFAULT NULL,
  ip_address  VARCHAR(45)  DEFAULT NULL,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_user_id   (user_id),
  KEY idx_module    (module, entity_type, entity_id),
  CONSTRAINT fk_logs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================================
-- 2. RESIDENTS & OFFICIALS
-- ============================================================================

CREATE TABLE residents (
  id               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  first_name       VARCHAR(60)  NOT NULL,
  middle_name      VARCHAR(60)  DEFAULT NULL,
  last_name        VARCHAR(60)  NOT NULL,
  name_suffix      VARCHAR(10)  DEFAULT NULL,
  alias            VARCHAR(60)  DEFAULT NULL,
  sex              VARCHAR(10)  NOT NULL CHECK (sex IN ('male','female')),
  birth_date       DATE         DEFAULT NULL,
  civil_status     VARCHAR(15)  DEFAULT NULL
                   CHECK (civil_status IN ('single','married','widowed','separated','divorced')),
  contact_number   VARCHAR(20)  DEFAULT NULL,
  email            VARCHAR(120) DEFAULT NULL,
  house_no         VARCHAR(20)  DEFAULT NULL,
  purok            VARCHAR(40)  DEFAULT NULL,
  street           VARCHAR(60)  DEFAULT NULL,
  zone             VARCHAR(20)  DEFAULT NULL,
  barangay         VARCHAR(60)  NOT NULL DEFAULT 'Barangay',
  municipality     VARCHAR(60)  NOT NULL DEFAULT 'Municipality',
  province         VARCHAR(60)  NOT NULL DEFAULT 'Province',
  blood_type       VARCHAR(3)   DEFAULT NULL,
  occupation       VARCHAR(60)  DEFAULT NULL,
  emergency_contact VARCHAR(120) DEFAULT NULL,
  profile_photo    VARCHAR(255) DEFAULT NULL,
  status           VARCHAR(20)  NOT NULL DEFAULT 'active'
                   CHECK (status IN ('active','inactive','deceased')),
  registered_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FULLTEXT KEY ft_resident_name (first_name, middle_name, last_name, alias)
) ENGINE=InnoDB;

CREATE TABLE barangay_officials (
  id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  resident_id    BIGINT UNSIGNED NOT NULL,
  position       VARCHAR(60) NOT NULL,
  term_start     DATE        NOT NULL,
  term_end       DATE        DEFAULT NULL,
  status         VARCHAR(20) NOT NULL DEFAULT 'active'
                 CHECK (status IN ('active','inactive')),
  CONSTRAINT fk_official_resident FOREIGN KEY (resident_id) REFERENCES residents(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================================
-- 3. ANNOUNCEMENTS
-- ============================================================================

CREATE TABLE announcements (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title         VARCHAR(160) NOT NULL,
  body          TEXT         NOT NULL,
  category      VARCHAR(20)  NOT NULL DEFAULT 'advisory'
                CHECK (category IN ('advisory','event','health','project','alert')),
  is_pinned     TINYINT(1)   NOT NULL DEFAULT 0,
  is_published  TINYINT(1)   NOT NULL DEFAULT 0,
  author_id     BIGINT UNSIGNED DEFAULT NULL,
  published_at  DATETIME     DEFAULT NULL,
  expires_at    DATETIME     DEFAULT NULL,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_category_published (category, is_published, published_at),
  CONSTRAINT fk_announcement_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================================
-- 4. CASES, LUPON & HEARINGS
-- ============================================================================

CREATE TABLE lupon_panels (
  id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(120) NOT NULL,
  created_by BIGINT UNSIGNED DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_panel_creator FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE lupon_members (
  id               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  resident_id      BIGINT UNSIGNED NOT NULL,
  position         VARCHAR(40)  NOT NULL,
  resolution_no    VARCHAR(30)  DEFAULT NULL,
  appointment_date DATE         NOT NULL,
  expiry_date      DATE         DEFAULT NULL,
  status           VARCHAR(20)  NOT NULL DEFAULT 'active'
                   CHECK (status IN ('active','inactive')),
  CONSTRAINT fk_lupon_resident FOREIGN KEY (resident_id) REFERENCES residents(id) ON DELETE CASCADE,
  UNIQUE KEY uq_resolution (resolution_no)
) ENGINE=InnoDB;

CREATE TABLE cases (
  id               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  case_reference   VARCHAR(30)  NOT NULL UNIQUE,
  case_type        VARCHAR(30)  NOT NULL DEFAULT 'lupon'
                   CHECK (case_type IN ('lupon','crime','administrative')),
  nature           VARCHAR(80)  DEFAULT NULL,
  subject          VARCHAR(160) NOT NULL,
  summary          TEXT         DEFAULT NULL,
  status           VARCHAR(25)  NOT NULL DEFAULT 'docketed'
                   CHECK (status IN ('docketed','for_preliminary','for_hearing','resolved','dismissed','archived')),
  filed_date       DATE         NOT NULL,
  lupon_panel_id   BIGINT UNSIGNED DEFAULT NULL,
  created_by       BIGINT UNSIGNED DEFAULT NULL,
  created_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_status_filed (status, filed_date),
  KEY idx_reference    (case_reference),
  CONSTRAINT fk_case_panel  FOREIGN KEY (lupon_panel_id) REFERENCES lupon_panels(id) ON DELETE SET NULL,
  CONSTRAINT fk_case_creator FOREIGN KEY (created_by)    REFERENCES users(id)        ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE case_parties (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  case_id     BIGINT UNSIGNED NOT NULL,
  resident_id BIGINT UNSIGNED NOT NULL,
  role        VARCHAR(20) NOT NULL DEFAULT 'complainant'
              CHECK (role IN ('complainant','respondent','witness','guardian')),
  notes       VARCHAR(255) DEFAULT NULL,
  CONSTRAINT fk_party_case    FOREIGN KEY (case_id)     REFERENCES cases(id)     ON DELETE CASCADE,
  CONSTRAINT fk_party_resident FOREIGN KEY (resident_id) REFERENCES residents(id) ON DELETE CASCADE,
  UNIQUE KEY uq_case_party_role (case_id, resident_id, role)
) ENGINE=InnoDB;

CREATE TABLE hearings (
  id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  case_id        BIGINT UNSIGNED NOT NULL,
  hearing_no     INT UNSIGNED NOT NULL,
  scheduled_date DATE         NOT NULL,
  start_time     TIME         DEFAULT NULL,
  end_time       TIME         DEFAULT NULL,
  venue          VARCHAR(120) NOT NULL,
  status         VARCHAR(20)  NOT NULL DEFAULT 'scheduled'
                 CHECK (status IN ('scheduled','held','postponed','cancelled')),
  outcome_notes  TEXT         DEFAULT NULL,
  created_by     BIGINT UNSIGNED DEFAULT NULL,
  created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_case_hearing (case_id, scheduled_date),
  CONSTRAINT fk_hearing_case    FOREIGN KEY (case_id)    REFERENCES cases(id) ON DELETE CASCADE,
  CONSTRAINT fk_hearing_creator FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE hearing_panel (
  id               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  hearing_id       BIGINT UNSIGNED NOT NULL,
  lupon_member_id  BIGINT UNSIGNED NOT NULL,
  role             VARCHAR(20) NOT NULL DEFAULT 'member'
                   CHECK (role IN ('chairman','member','secretary')),
  CONSTRAINT fk_panel_hearing  FOREIGN KEY (hearing_id)      REFERENCES hearings(id)        ON DELETE CASCADE,
  CONSTRAINT fk_panel_member   FOREIGN KEY (lupon_member_id) REFERENCES lupon_members(id)    ON DELETE CASCADE,
  UNIQUE KEY uq_hearing_member (hearing_id, lupon_member_id)
) ENGINE=InnoDB;

-- ============================================================================
-- 5. CRIME REGISTRY & WANTED PERSONS
-- ============================================================================

CREATE TABLE crime_reports (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title         VARCHAR(160) NOT NULL,
  incident_type VARCHAR(30)  NOT NULL
                CHECK (incident_type IN ('theft','robbery','vandalism','disturbance','assault','other')),
  description   TEXT         NOT NULL,
  incident_date DATETIME     NOT NULL,
  location      VARCHAR(120) NOT NULL,
  severity      VARCHAR(10)  NOT NULL DEFAULT 'low'
                CHECK (severity IN ('low','medium','high')),
  status        VARCHAR(20)  NOT NULL DEFAULT 'active'
                CHECK (status IN ('active','under_investigation','resolved','closed')),
  reported_by   BIGINT UNSIGNED DEFAULT NULL,
  remarks       TEXT         DEFAULT NULL,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_status_severity (status, severity),
  CONSTRAINT fk_crime_reporter FOREIGN KEY (reported_by) REFERENCES residents(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE wanted_persons (
  id                    BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  resident_id           BIGINT UNSIGNED DEFAULT NULL,
  first_name            VARCHAR(60)  NOT NULL,
  middle_name           VARCHAR(60)  DEFAULT NULL,
  last_name             VARCHAR(60)  NOT NULL,
  alias                 VARCHAR(60)  DEFAULT NULL,
  sex                   VARCHAR(10)  DEFAULT NULL,
  birth_date            DATE         DEFAULT NULL,
  photo                 VARCHAR(255) DEFAULT NULL,
  danger_level          VARCHAR(10)  NOT NULL DEFAULT 'low'
                        CHECK (danger_level IN ('low','moderate','high')),
  charges_or_description TEXT        DEFAULT NULL,
  last_known_location   VARCHAR(120) DEFAULT NULL,
  status                VARCHAR(20)  NOT NULL DEFAULT 'wanted'
                        CHECK (status IN ('wanted','arrested','cleared','deactivated')),
  created_at            DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_status (status),
  FULLTEXT KEY ft_wanted_name (first_name, middle_name, last_name, alias),
  CONSTRAINT fk_wanted_resident FOREIGN KEY (resident_id) REFERENCES residents(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE case_suspects (
  id                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  case_id           BIGINT UNSIGNED NOT NULL,
  wanted_person_id  BIGINT UNSIGNED DEFAULT NULL,
  resident_id       BIGINT UNSIGNED DEFAULT NULL,
  status            VARCHAR(20) NOT NULL DEFAULT 'suspect'
                    CHECK (status IN ('suspect','person_of_interest','cleared','charged')),
  CONSTRAINT fk_suspect_case     FOREIGN KEY (case_id)          REFERENCES cases(id)          ON DELETE CASCADE,
  CONSTRAINT fk_suspect_wanted   FOREIGN KEY (wanted_person_id) REFERENCES wanted_persons(id) ON DELETE SET NULL,
  CONSTRAINT fk_suspect_resident FOREIGN KEY (resident_id)      REFERENCES residents(id)      ON DELETE SET NULL,
  KEY idx_case (case_id)
) ENGINE=InnoDB;

-- ============================================================================
-- 6. LOST & FOUND
-- ============================================================================

CREATE TABLE lost_found_items (
  id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  type           VARCHAR(10)  NOT NULL CHECK (type IN ('lost','found')),
  item_name      VARCHAR(120) NOT NULL,
  category       VARCHAR(40)  DEFAULT NULL,
  description    TEXT         NOT NULL,
  location       VARCHAR(120) NOT NULL,
  date_lost_found DATE        NOT NULL,
  photo          VARCHAR(255) DEFAULT NULL,
  status         VARCHAR(20)  NOT NULL DEFAULT 'open'
                 CHECK (status IN ('open','pending_claim','claimed','returned','closed')),
  reported_by    BIGINT UNSIGNED DEFAULT NULL,
  claimant_id    BIGINT UNSIGNED DEFAULT NULL,
  claimed_at     DATETIME     DEFAULT NULL,
  created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_type_status (type, status),
  CONSTRAINT fk_lf_reporter  FOREIGN KEY (reported_by) REFERENCES residents(id) ON DELETE SET NULL,
  CONSTRAINT fk_lf_claimant  FOREIGN KEY (claimant_id) REFERENCES residents(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================================
-- 7. DOCUMENTS & PNP REQUESTS (central file registry)
-- ============================================================================

CREATE TABLE documents (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  entity_type VARCHAR(30)  NOT NULL
              CHECK (entity_type IN ('case','hearing','crime_report','announcement',
                                     'lost_found_item','wanted_person','resident','user')),
  entity_id   BIGINT UNSIGNED NOT NULL,
  doc_type    VARCHAR(40)  NOT NULL
              CHECK (doc_type IN ('cfa','subpoena','hearing_log','complaint_record',
                                  'settlement','certificate','photo','proof','misc')),
  title       VARCHAR(160) NOT NULL,
  description TEXT         DEFAULT NULL,
  file_name   VARCHAR(255) NOT NULL,
  file_path   VARCHAR(500) NOT NULL,
  mime_type   VARCHAR(80)  NOT NULL,
  file_size   BIGINT UNSIGNED NOT NULL,
  version     INT UNSIGNED NOT NULL DEFAULT 1,
  is_public   TINYINT(1)   NOT NULL DEFAULT 0,
  uploaded_by BIGINT UNSIGNED DEFAULT NULL,
  uploaded_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_entity       (entity_type, entity_id),
  KEY idx_doc_type     (doc_type, entity_type),
  CONSTRAINT fk_doc_uploader FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE document_requests (
  id               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  request_code     VARCHAR(30)  NOT NULL UNIQUE,
  requester_id     BIGINT UNSIGNED NOT NULL,
  requesting_office VARCHAR(120) NOT NULL,
  purpose          VARCHAR(255) NOT NULL,
  status           VARCHAR(20)  NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending','approved','rejected','fulfilled')),
  approved_by      BIGINT UNSIGNED DEFAULT NULL,
  reviewed_at      DATETIME     DEFAULT NULL,
  notes            TEXT         DEFAULT NULL,
  requested_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fulfilled_at     DATETIME     DEFAULT NULL,
  CONSTRAINT fk_request_requester FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_request_approver  FOREIGN KEY (approved_by)  REFERENCES users(id) ON DELETE SET NULL,
  KEY idx_status (status)
) ENGINE=InnoDB;

CREATE TABLE document_request_items (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  request_id  BIGINT UNSIGNED NOT NULL,
  document_id BIGINT UNSIGNED DEFAULT NULL,
  entity_type VARCHAR(30)  DEFAULT NULL,
  entity_id   BIGINT UNSIGNED DEFAULT NULL,
  notes       VARCHAR(255) DEFAULT NULL,
  CONSTRAINT fk_dri_request  FOREIGN KEY (request_id)  REFERENCES document_requests(id) ON DELETE CASCADE,
  CONSTRAINT fk_dri_document FOREIGN KEY (document_id) REFERENCES documents(id)         ON DELETE SET NULL,
  KEY idx_request (request_id)
) ENGINE=InnoDB;

-- ============================================================================
-- 8. SITE SETTINGS
-- ============================================================================

CREATE TABLE settings (
  id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `key`      VARCHAR(60)  NOT NULL UNIQUE,
  value      TEXT         DEFAULT NULL,
  updated_by BIGINT UNSIGNED DEFAULT NULL,
  updated_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_settings_editor FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;