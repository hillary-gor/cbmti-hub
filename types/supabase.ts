export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      announcements: {
        Row: {
          course_id: string
          created_at: string | null
          id: string
          message: string
          title: string
        }
        Insert: {
          course_id: string
          created_at?: string | null
          id?: string
          message: string
          title: string
        }
        Update: {
          course_id?: string
          created_at?: string | null
          id?: string
          message?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcements_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      application_info: {
        Row: {
          course: string | null
          created_at: string | null
          disability_status: boolean | null
          disability_type: string | null
          id: string
          intake_month: string | null
          intake_year: number | null
          mode_of_study: string | null
          payment_method: string | null
          payment_reference: string | null
          session: string | null
          student_id: string
          study_center: string | null
        }
        Insert: {
          course?: string | null
          created_at?: string | null
          disability_status?: boolean | null
          disability_type?: string | null
          id?: string
          intake_month?: string | null
          intake_year?: number | null
          mode_of_study?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          session?: string | null
          student_id: string
          study_center?: string | null
        }
        Update: {
          course?: string | null
          created_at?: string | null
          disability_status?: boolean | null
          disability_type?: string | null
          id?: string
          intake_month?: string | null
          intake_year?: number | null
          mode_of_study?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          session?: string | null
          student_id?: string
          study_center?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "application_info_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "application_info_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_student_summary"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "application_info_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_students_detailed"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "application_info_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_transcript_data"
            referencedColumns: ["student_id"]
          },
        ]
      }
      assessments: {
        Row: {
          course_id: string | null
          created_at: string | null
          description: string | null
          id: string
          title: string
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          title: string
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      attachments: {
        Row: {
          course_id: string | null
          end_date: string | null
          enrollment_id: string | null
          facility_name: string | null
          id: string
          start_date: string | null
          status: string | null
          student_id: string | null
          supervisor_name: string | null
        }
        Insert: {
          course_id?: string | null
          end_date?: string | null
          enrollment_id?: string | null
          facility_name?: string | null
          id?: string
          start_date?: string | null
          status?: string | null
          student_id?: string | null
          supervisor_name?: string | null
        }
        Update: {
          course_id?: string | null
          end_date?: string | null
          enrollment_id?: string | null
          facility_name?: string | null
          id?: string
          start_date?: string | null
          status?: string | null
          student_id?: string | null
          supervisor_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attachments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attachments_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attachments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attachments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_student_summary"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "attachments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_students_detailed"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attachments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_transcript_data"
            referencedColumns: ["student_id"]
          },
        ]
      }
      attendance: {
        Row: {
          attendance_date: string
          course_id: string | null
          created_at: string | null
          id: string
          ip_address: string | null
          marked_at: string | null
          recorded_by: string | null
          session_id: string | null
          status: Database["public"]["Enums"]["attendance_status"] | null
          student_id: string | null
        }
        Insert: {
          attendance_date: string
          course_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          marked_at?: string | null
          recorded_by?: string | null
          session_id?: string | null
          status?: Database["public"]["Enums"]["attendance_status"] | null
          student_id?: string | null
        }
        Update: {
          attendance_date?: string
          course_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          marked_at?: string | null
          recorded_by?: string | null
          session_id?: string | null
          status?: Database["public"]["Enums"]["attendance_status"] | null
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "instructors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_student_summary"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "attendance_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_students_detailed"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_transcript_data"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "fk_attendance_session"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_session"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_records: {
        Row: {
          id: string
          recorded_at: string | null
          recorded_by: string
          session_id: string
          status: string
          student_id: string
        }
        Insert: {
          id?: string
          recorded_at?: string | null
          recorded_by: string
          session_id: string
          status: string
          student_id: string
        }
        Update: {
          id?: string
          recorded_at?: string | null
          recorded_by?: string
          session_id?: string
          status?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_records_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "eligible_student_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "attendance_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_student_summary"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "attendance_records_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_students_detailed"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_transcript_data"
            referencedColumns: ["student_id"]
          },
        ]
      }
      attendance_sessions: {
        Row: {
          course_id: string
          created_at: string | null
          created_by: string
          id: string
          intake_id: string
          session_date: string
          time_slot: string
          topic: string | null
        }
        Insert: {
          course_id: string
          created_at?: string | null
          created_by: string
          id?: string
          intake_id: string
          session_date: string
          time_slot: string
          topic?: string | null
        }
        Update: {
          course_id?: string
          created_at?: string | null
          created_by?: string
          id?: string
          intake_id?: string
          session_date?: string
          time_slot?: string
          topic?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_sessions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_sessions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "eligible_student_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_sessions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_sessions_intake_id_fkey"
            columns: ["intake_id"]
            isOneToOne: false
            referencedRelation: "intakes"
            referencedColumns: ["id"]
          },
        ]
      }
      certificates: {
        Row: {
          certificate_number: string | null
          course_id: string | null
          file_url: string | null
          id: string
          issue_date: string | null
          remarks: string | null
          student_id: string | null
        }
        Insert: {
          certificate_number?: string | null
          course_id?: string | null
          file_url?: string | null
          id?: string
          issue_date?: string | null
          remarks?: string | null
          student_id?: string | null
        }
        Update: {
          certificate_number?: string | null
          course_id?: string | null
          file_url?: string | null
          id?: string
          issue_date?: string | null
          remarks?: string | null
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "certificates_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_student_summary"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "certificates_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_students_detailed"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_transcript_data"
            referencedColumns: ["student_id"]
          },
        ]
      }
      consent_acknowledgments: {
        Row: {
          accepted_admission_policies: boolean | null
          accepted_fee_policies: boolean | null
          agreed_code_of_conduct: boolean | null
          agreed_liability_waiver: boolean | null
          consent_communication_policy: boolean | null
          consent_data_use: boolean | null
          consent_photo_release: boolean | null
          id: string
          signed_at: string | null
          student_id: string
        }
        Insert: {
          accepted_admission_policies?: boolean | null
          accepted_fee_policies?: boolean | null
          agreed_code_of_conduct?: boolean | null
          agreed_liability_waiver?: boolean | null
          consent_communication_policy?: boolean | null
          consent_data_use?: boolean | null
          consent_photo_release?: boolean | null
          id?: string
          signed_at?: string | null
          student_id: string
        }
        Update: {
          accepted_admission_policies?: boolean | null
          accepted_fee_policies?: boolean | null
          agreed_code_of_conduct?: boolean | null
          agreed_liability_waiver?: boolean | null
          consent_communication_policy?: boolean | null
          consent_data_use?: boolean | null
          consent_photo_release?: boolean | null
          id?: string
          signed_at?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "consent_acknowledgments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consent_acknowledgments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_student_summary"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "consent_acknowledgments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_students_detailed"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consent_acknowledgments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_transcript_data"
            referencedColumns: ["student_id"]
          },
        ]
      }
      course_intakes: {
        Row: {
          course_id: string | null
          created_at: string | null
          id: string
          intake_id: string | null
          updated_at: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          intake_id?: string | null
          updated_at?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          intake_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_intakes_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_intakes_intake_id_fkey"
            columns: ["intake_id"]
            isOneToOne: false
            referencedRelation: "intakes"
            referencedColumns: ["id"]
          },
        ]
      }
      course_specific_declarations: {
        Row: {
          accepted_offer: boolean | null
          agreed_to_clinical_attachment: boolean | null
          agreed_to_exam_rules: boolean | null
          agreed_to_fees: boolean | null
          agreed_to_hca_policy: boolean | null
          agreed_to_nita_exam_policy: boolean | null
          course_name: string | null
          declaration_signed_at: string | null
          id: string
          no_refund_policy: boolean | null
          student_id: string
        }
        Insert: {
          accepted_offer?: boolean | null
          agreed_to_clinical_attachment?: boolean | null
          agreed_to_exam_rules?: boolean | null
          agreed_to_fees?: boolean | null
          agreed_to_hca_policy?: boolean | null
          agreed_to_nita_exam_policy?: boolean | null
          course_name?: string | null
          declaration_signed_at?: string | null
          id?: string
          no_refund_policy?: boolean | null
          student_id: string
        }
        Update: {
          accepted_offer?: boolean | null
          agreed_to_clinical_attachment?: boolean | null
          agreed_to_exam_rules?: boolean | null
          agreed_to_fees?: boolean | null
          agreed_to_hca_policy?: boolean | null
          agreed_to_nita_exam_policy?: boolean | null
          course_name?: string | null
          declaration_signed_at?: string | null
          id?: string
          no_refund_policy?: boolean | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_specific_declarations_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_specific_declarations_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_student_summary"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "course_specific_declarations_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_students_detailed"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_specific_declarations_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_transcript_data"
            referencedColumns: ["student_id"]
          },
        ]
      }
      courses: {
        Row: {
          code: string
          created_at: string | null
          department_id: string | null
          description: string | null
          duration_weeks: number | null
          has_attachment: boolean | null
          id: string
          intake_id: string | null
          lecturer_id: string | null
          long_description: string | null
          title: string
        }
        Insert: {
          code: string
          created_at?: string | null
          department_id?: string | null
          description?: string | null
          duration_weeks?: number | null
          has_attachment?: boolean | null
          id?: string
          intake_id?: string | null
          lecturer_id?: string | null
          long_description?: string | null
          title: string
        }
        Update: {
          code?: string
          created_at?: string | null
          department_id?: string | null
          description?: string | null
          duration_weeks?: number | null
          has_attachment?: boolean | null
          id?: string
          intake_id?: string | null
          lecturer_id?: string | null
          long_description?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_intake_id_fkey"
            columns: ["intake_id"]
            isOneToOne: false
            referencedRelation: "intakes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_lecturer_id_fkey"
            columns: ["lecturer_id"]
            isOneToOne: false
            referencedRelation: "lecturers"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      education_background: {
        Row: {
          created_at: string | null
          examining_body: string | null
          from_year: number | null
          id: string
          index_no: string | null
          qualification: string | null
          school_name: string | null
          student_id: string
          to_year: number | null
        }
        Insert: {
          created_at?: string | null
          examining_body?: string | null
          from_year?: number | null
          id?: string
          index_no?: string | null
          qualification?: string | null
          school_name?: string | null
          student_id: string
          to_year?: number | null
        }
        Update: {
          created_at?: string | null
          examining_body?: string | null
          from_year?: number | null
          id?: string
          index_no?: string | null
          qualification?: string | null
          school_name?: string | null
          student_id?: string
          to_year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "education_background_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "education_background_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_student_summary"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "education_background_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_students_detailed"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "education_background_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_transcript_data"
            referencedColumns: ["student_id"]
          },
        ]
      }
      emergency_contacts: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          id_or_passport_no: string | null
          phone_number: string | null
          student_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          id_or_passport_no?: string | null
          phone_number?: string | null
          student_id: string
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          id_or_passport_no?: string | null
          phone_number?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "emergency_contacts_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emergency_contacts_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_student_summary"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "emergency_contacts_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_students_detailed"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emergency_contacts_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_transcript_data"
            referencedColumns: ["student_id"]
          },
        ]
      }
      enrollments: {
        Row: {
          completed_at: string | null
          course_id: string | null
          enrolled_at: string | null
          id: string
          intake_id: string | null
          is_active: boolean | null
          remarks: string | null
          status: string | null
          student_id: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          course_id?: string | null
          enrolled_at?: string | null
          id?: string
          intake_id?: string | null
          is_active?: boolean | null
          remarks?: string | null
          status?: string | null
          student_id?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          course_id?: string | null
          enrolled_at?: string | null
          id?: string
          intake_id?: string | null
          is_active?: boolean | null
          remarks?: string | null
          status?: string | null
          student_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_intake_id_fkey"
            columns: ["intake_id"]
            isOneToOne: false
            referencedRelation: "intakes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_student_summary"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_students_detailed"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_transcript_data"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "fk_student_id"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_student_id"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_student_summary"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "fk_student_id"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_students_detailed"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_student_id"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_transcript_data"
            referencedColumns: ["student_id"]
          },
        ]
      }
      fee_payments: {
        Row: {
          account_number: string | null
          amount: number
          id: string
          institution: string | null
          message_text: string
          parsed_date: string
          parsed_time: string | null
          recorded_at: string
          reference: string
          source: string | null
          status: string
          student_id: string
        }
        Insert: {
          account_number?: string | null
          amount: number
          id?: string
          institution?: string | null
          message_text: string
          parsed_date: string
          parsed_time?: string | null
          recorded_at?: string
          reference: string
          source?: string | null
          status?: string
          student_id: string
        }
        Update: {
          account_number?: string | null
          amount?: number
          id?: string
          institution?: string | null
          message_text?: string
          parsed_date?: string
          parsed_time?: string | null
          recorded_at?: string
          reference?: string
          source?: string | null
          status?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fee_payments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fee_payments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_student_summary"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "fee_payments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_students_detailed"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fee_payments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_transcript_data"
            referencedColumns: ["student_id"]
          },
        ]
      }
      fee_structures: {
        Row: {
          academic_year: string
          amount: number
          category_id: string | null
          course_id: string | null
          id: string
          is_active: boolean | null
        }
        Insert: {
          academic_year: string
          amount: number
          category_id?: string | null
          course_id?: string | null
          id?: string
          is_active?: boolean | null
        }
        Update: {
          academic_year?: string
          amount?: number
          category_id?: string | null
          course_id?: string | null
          id?: string
          is_active?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "fee_structures_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      grades: {
        Row: {
          average_cat: number | null
          cat1: number | null
          cat2: number | null
          cat3: number | null
          cat4: number | null
          course_id: string | null
          created_at: string | null
          credit_earned: number | null
          final_score: number | null
          fqe: number | null
          grade: string | null
          id: string
          recorded_by: string | null
          remark: string | null
          student_id: string | null
          sup_cat: number | null
          sup_fqe: number | null
        }
        Insert: {
          average_cat?: number | null
          cat1?: number | null
          cat2?: number | null
          cat3?: number | null
          cat4?: number | null
          course_id?: string | null
          created_at?: string | null
          credit_earned?: number | null
          final_score?: number | null
          fqe?: number | null
          grade?: string | null
          id?: string
          recorded_by?: string | null
          remark?: string | null
          student_id?: string | null
          sup_cat?: number | null
          sup_fqe?: number | null
        }
        Update: {
          average_cat?: number | null
          cat1?: number | null
          cat2?: number | null
          cat3?: number | null
          cat4?: number | null
          course_id?: string | null
          created_at?: string | null
          credit_earned?: number | null
          final_score?: number | null
          fqe?: number | null
          grade?: string | null
          id?: string
          recorded_by?: string | null
          remark?: string | null
          student_id?: string | null
          sup_cat?: number | null
          sup_fqe?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "grades_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grades_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "eligible_student_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grades_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grades_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grades_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_student_summary"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "grades_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_students_detailed"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grades_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_transcript_data"
            referencedColumns: ["student_id"]
          },
        ]
      }
      guardian_declarations: {
        Row: {
          guardian_agrees_to_terms: boolean | null
          guardian_email: string | null
          guardian_full_name: string | null
          guardian_id_number: string | null
          id: string
          signed_at: string | null
          student_id: string
        }
        Insert: {
          guardian_agrees_to_terms?: boolean | null
          guardian_email?: string | null
          guardian_full_name?: string | null
          guardian_id_number?: string | null
          id?: string
          signed_at?: string | null
          student_id: string
        }
        Update: {
          guardian_agrees_to_terms?: boolean | null
          guardian_email?: string | null
          guardian_full_name?: string | null
          guardian_id_number?: string | null
          id?: string
          signed_at?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guardian_declarations_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guardian_declarations_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_student_summary"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "guardian_declarations_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_students_detailed"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guardian_declarations_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_transcript_data"
            referencedColumns: ["student_id"]
          },
        ]
      }
      instructors: {
        Row: {
          bio: string | null
          department_id: string | null
          id: string
        }
        Insert: {
          bio?: string | null
          department_id?: string | null
          id: string
        }
        Update: {
          bio?: string | null
          department_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "instructors_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "instructors_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "eligible_student_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "instructors_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      intakes: {
        Row: {
          closes_on: string | null
          created_at: string | null
          id: string
          label: string | null
          month: string
          opens_on: string | null
          status: string | null
          year: number
        }
        Insert: {
          closes_on?: string | null
          created_at?: string | null
          id?: string
          label?: string | null
          month: string
          opens_on?: string | null
          status?: string | null
          year: number
        }
        Update: {
          closes_on?: string | null
          created_at?: string | null
          id?: string
          label?: string | null
          month?: string
          opens_on?: string | null
          status?: string | null
          year?: number
        }
        Relationships: []
      }
      lecturers: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          department: string | null
          dob: string | null
          full_name: string | null
          gender: string | null
          id: string
          is_active: boolean | null
          location: string | null
          profile_completed: boolean | null
          updated_at: string | null
          user_id: string
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          dob?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          profile_completed?: boolean | null
          updated_at?: string | null
          user_id: string
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          dob?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          profile_completed?: boolean | null
          updated_at?: string | null
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      next_of_kin: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          id_or_passport_no: string | null
          phone_number: string | null
          relationship: string | null
          student_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          id_or_passport_no?: string | null
          phone_number?: string | null
          relationship?: string | null
          student_id: string
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          id_or_passport_no?: string | null
          phone_number?: string | null
          relationship?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "next_of_kin_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "next_of_kin_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_student_summary"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "next_of_kin_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_students_detailed"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "next_of_kin_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_transcript_data"
            referencedColumns: ["student_id"]
          },
        ]
      }
      referees: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          phone_number: string | null
          postal_code: string | null
          student_id: string
          town_city: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone_number?: string | null
          postal_code?: string | null
          student_id: string
          town_city?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone_number?: string | null
          postal_code?: string | null
          student_id?: string
          town_city?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referees_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referees_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_student_summary"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "referees_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_students_detailed"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referees_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_transcript_data"
            referencedColumns: ["student_id"]
          },
        ]
      }
      sessions: {
        Row: {
          attendance_window_end: string | null
          attendance_window_start: string | null
          course_intake_id: string | null
          created_at: string | null
          end_time: string
          id: string
          is_attendance_active: boolean | null
          last_qr_code_generated_at: string | null
          last_qr_code_value: string | null
          lecturer_id: string | null
          session_date: string
          start_time: string
          updated_at: string | null
        }
        Insert: {
          attendance_window_end?: string | null
          attendance_window_start?: string | null
          course_intake_id?: string | null
          created_at?: string | null
          end_time: string
          id?: string
          is_attendance_active?: boolean | null
          last_qr_code_generated_at?: string | null
          last_qr_code_value?: string | null
          lecturer_id?: string | null
          session_date: string
          start_time: string
          updated_at?: string | null
        }
        Update: {
          attendance_window_end?: string | null
          attendance_window_start?: string | null
          course_intake_id?: string | null
          created_at?: string | null
          end_time?: string
          id?: string
          is_attendance_active?: boolean | null
          last_qr_code_generated_at?: string | null
          last_qr_code_value?: string | null
          lecturer_id?: string | null
          session_date?: string
          start_time?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_course_intake_id_fkey"
            columns: ["course_intake_id"]
            isOneToOne: false
            referencedRelation: "course_intakes"
            referencedColumns: ["id"]
          },
        ]
      }
      student_accounts: {
        Row: {
          balance: number
          created_at: string | null
          created_by: string | null
          id: string
          student_id: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          balance?: number
          created_at?: string | null
          created_by?: string | null
          id?: string
          student_id?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          balance?: number
          created_at?: string | null
          created_by?: string | null
          id?: string
          student_id?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_accounts_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_accounts_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_student_summary"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "student_accounts_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_students_detailed"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_accounts_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_transcript_data"
            referencedColumns: ["student_id"]
          },
        ]
      }
      student_attachments: {
        Row: {
          category: string | null
          file_name: string
          file_path: string
          id: string
          student_id: string | null
          uploaded_at: string | null
        }
        Insert: {
          category?: string | null
          file_name: string
          file_path: string
          id?: string
          student_id?: string | null
          uploaded_at?: string | null
        }
        Update: {
          category?: string | null
          file_name?: string
          file_path?: string
          id?: string
          student_id?: string | null
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_attachments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_attachments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_student_summary"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "student_attachments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_students_detailed"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_attachments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_transcript_data"
            referencedColumns: ["student_id"]
          },
        ]
      }
      students: {
        Row: {
          address: string | null
          course_id: string | null
          created_at: string | null
          date_of_birth: string | null
          department_id: string | null
          email: string | null
          enrollment_year: number | null
          full_name: string | null
          gender: string | null
          graduated_at: string | null
          id: string
          intake_id: string | null
          marital_status: string | null
          merged_file_url: string | null
          national_id: string | null
          nationality: string | null
          phone_number: string | null
          postal_code: string | null
          reg_number: string | null
          religion: string | null
          serial_no: number | null
          status: string | null
          town_city: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          course_id?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          department_id?: string | null
          email?: string | null
          enrollment_year?: number | null
          full_name?: string | null
          gender?: string | null
          graduated_at?: string | null
          id?: string
          intake_id?: string | null
          marital_status?: string | null
          merged_file_url?: string | null
          national_id?: string | null
          nationality?: string | null
          phone_number?: string | null
          postal_code?: string | null
          reg_number?: string | null
          religion?: string | null
          serial_no?: number | null
          status?: string | null
          town_city?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          course_id?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          department_id?: string | null
          email?: string | null
          enrollment_year?: number | null
          full_name?: string | null
          gender?: string | null
          graduated_at?: string | null
          id?: string
          intake_id?: string | null
          marital_status?: string | null
          merged_file_url?: string | null
          national_id?: string | null
          nationality?: string | null
          phone_number?: string | null
          postal_code?: string | null
          reg_number?: string | null
          religion?: string | null
          serial_no?: number | null
          status?: string | null
          town_city?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "eligible_student_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_intake_id_fkey"
            columns: ["intake_id"]
            isOneToOne: false
            referencedRelation: "intakes"
            referencedColumns: ["id"]
          },
        ]
      }
      submissions: {
        Row: {
          assessment_id: string
          feedback: string | null
          file_url: string | null
          grade: number | null
          id: string
          student_id: string
          submitted_at: string | null
        }
        Insert: {
          assessment_id: string
          feedback?: string | null
          file_url?: string | null
          grade?: number | null
          id?: string
          student_id: string
          submitted_at?: string | null
        }
        Update: {
          assessment_id?: string
          feedback?: string | null
          file_url?: string | null
          grade?: number | null
          id?: string
          student_id?: string
          submitted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "submissions_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_student_summary"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "submissions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_students_detailed"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_transcript_data"
            referencedColumns: ["student_id"]
          },
        ]
      }
      transcripts: {
        Row: {
          academic_year: string | null
          created_at: string | null
          file_url: string | null
          id: string
          student_id: string | null
        }
        Insert: {
          academic_year?: string | null
          created_at?: string | null
          file_url?: string | null
          id?: string
          student_id?: string | null
        }
        Update: {
          academic_year?: string | null
          created_at?: string | null
          file_url?: string | null
          id?: string
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transcripts_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transcripts_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_student_summary"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "transcripts_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_students_detailed"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transcripts_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_transcript_data"
            referencedColumns: ["student_id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          dob: string | null
          email: string
          full_name: string | null
          gender: string | null
          id: string
          is_active: boolean | null
          location: string | null
          phone: string | null
          profile_completed: boolean | null
          role: string | null
          updated_at: string | null
          user_id: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          dob?: string | null
          email: string
          full_name?: string | null
          gender?: string | null
          id: string
          is_active?: boolean | null
          location?: string | null
          phone?: string | null
          profile_completed?: boolean | null
          role?: string | null
          updated_at?: string | null
          user_id?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          dob?: string | null
          email?: string
          full_name?: string | null
          gender?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          phone?: string | null
          profile_completed?: boolean | null
          role?: string | null
          updated_at?: string | null
          user_id?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      work_experience: {
        Row: {
          created_at: string | null
          designation: string | null
          employer: string | null
          from_year: number | null
          id: string
          nature_of_assignment: string | null
          student_id: string
          to_year: number | null
        }
        Insert: {
          created_at?: string | null
          designation?: string | null
          employer?: string | null
          from_year?: number | null
          id?: string
          nature_of_assignment?: string | null
          student_id: string
          to_year?: number | null
        }
        Update: {
          created_at?: string | null
          designation?: string | null
          employer?: string | null
          from_year?: number | null
          id?: string
          nature_of_assignment?: string | null
          student_id?: string
          to_year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "work_experience_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_experience_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_student_summary"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "work_experience_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_students_detailed"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_experience_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_transcript_data"
            referencedColumns: ["student_id"]
          },
        ]
      }
    }
    Views: {
      eligible_student_users: {
        Row: {
          email: string | null
          full_name: string | null
          id: string | null
        }
        Relationships: []
      }
      v_intake_summary: {
        Row: {
          label: string | null
          student_count: number | null
        }
        Relationships: []
      }
      v_student_summary: {
        Row: {
          attachment_status: string | null
          course: string | null
          department: string | null
          enrollment_status: string | null
          full_name: string | null
          grade: string | null
          student_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_id_fkey"
            columns: ["student_id"]
            isOneToOne: true
            referencedRelation: "eligible_student_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_id_fkey"
            columns: ["student_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      v_students_detailed: {
        Row: {
          department: string | null
          full_name: string | null
          graduated_at: string | null
          id: string | null
          intake: string | null
          month: string | null
          reg_number: string | null
          status: string | null
          year: number | null
        }
        Relationships: [
          {
            foreignKeyName: "students_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "eligible_student_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      v_transcript_data: {
        Row: {
          course: string | null
          department: string | null
          full_name: string | null
          grade: string | null
          recorded_at: string | null
          student_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_id_fkey"
            columns: ["student_id"]
            isOneToOne: true
            referencedRelation: "eligible_student_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_id_fkey"
            columns: ["student_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      add_to_balance: {
        Args: { sid: string; amt: number }
        Returns: number
      }
      admit_student_tx: {
        Args: {
          student_data: Json
          application_info: Json
          next_of_kin: Json
          emergency_contact: Json
          guardian_declaration: Json
          education_background: Json[]
          work_experience: Json[]
          referees: Json[]
        }
        Returns: undefined
      }
      get_eligible_users: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          email: string
          full_name: string
        }[]
      }
      set_reg_number: {
        Args: { student_id: string }
        Returns: undefined
      }
    }
    Enums: {
      attendance_status: "present" | "absent" | "excused"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
export type SessionWithCourse = Tables<'sessions'> & {
  courses: Tables<'courses'> | null;
};

export interface Course {
  id: string;
  title: string;
  code: string;
  // Add other course properties if you fetch them, e.g., description, etc.
}

export interface Intake {
  id: string;
  label: string;
  // Add other intake properties if you fetch them, e.g., year, month, status, etc.
}

// Defines the structure of the data joined from the course_intakes table
export interface CourseIntakeJoined {
  id: string; // The ID of the entry in public.course_intakes
  courses: Course | null; // The joined course details
  intakes: Intake | null; // The joined intake details
}

export type IntakeRow = Tables<'intakes'>;

export type CourseWithIntake = Tables<'courses'> & {
  intakes: IntakeRow | null;                
};

export type SessionWithCourseAndIntake = Tables<'sessions'> & {
  course_intakes: (Tables<'course_intakes'> & {
    courses: Tables<'courses'> | null;
    intakes: Tables<'intakes'> | null;
  }) | null;
};
export const Constants = {
  public: {
    Enums: {
      attendance_status: ["present", "absent", "excused"],
    },
  },
} as const
