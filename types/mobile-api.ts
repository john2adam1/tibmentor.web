// TypeScript interfaces for Mobile API endpoints
// Based on Swagger documentation at https://prod.axadjonovsardorbek.uz/api/swagger/index.html

// ============================================================================
// Authentication Types
// ============================================================================

export interface UserCheckReq {
  phone_number?: string;
  email?: string;
}


export interface UserCheckRes {
  has_account: boolean;
}

export interface UserLoginReq {
  login: string;
  password: string;
}

export interface OtpSendReq {
  identifier: string;
  type: "email" | "telegram";
}

export interface OtpConfirmReq {
  identifier: string;
  confirmation_code: string;
  type: "email" | "telegram";
}

export interface OtpRes {
  token: string;
}

export interface UserRegisterReq {
  phone_number: string;
  full_name: string;
  password: string;
}

export interface TokenRes {
  access_token: string;
  refresh_token?: string;
  id?: string;
  role?: string;
}

export interface ChangePasswordBody {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

// ============================================================================
// User/Profile Types
// ============================================================================

/** @deprecated legacy fixed packages — premium is now sold per subject (subject_id) */
export type PremiumPackage = 'fundamental' | 'preclinical' | 'clinical';
export type ContentType = 'video' | 'audio' | 'document' | 'test';

export interface UserPackageStatus {
  subject_id: string;
  name: string;
  is_active: boolean;
  until: string | null;
}

export interface UserRes {
  id: string;
  phone_number: string;
  email?: string;
  name: string;
  fcm_token?: string;
  image_url?: string;
  language?: string;
  is_premium?: boolean;
  premium_until?: string | null;
  is_ustoz?: boolean;
  first_login_at?: string;
  last_seen_at?: string;
  tests_count?: number;
  packages?: UserPackageStatus[];
  created_at: string;
  updated_at: string;
}

export interface ProfileUpdateBody {
  name?: string;
  phone_number?: string;
  email?: string;
  fcm_token?: string;
  language?: string;
  image?: File;
}


// ============================================================================
// Course Types
// ============================================================================

export interface CourseMobileRes {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  is_public: boolean;
  order_num: number;
  teacher_id?: string;
  teacher_name?: string;
}

export interface CourseMobileList {
  courses: CourseMobileRes[];
  count: number;
}

export interface MobileCourseRes {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  is_public?: boolean;
  can_buy?: boolean;
  documents: number;
  duration: number;
  has_access: boolean;
  lessons: number;
  tests: number;
  /** Subject that unlocks this course with premium (T-12) */
  subject_id?: string;
  /** Subject premium price per month; 0/undefined = subject is not premium */
  premium_price?: number;
  /** @deprecated */
  package?: PremiumPackage | null;
  modules: MobileCourseModuleRes[];
  price?: CoursePriceOption[];
  teacher_id?: string;
  teacher_name?: string;
}

export interface MobileCourseModuleRes {
  id: string;
  course_id: string;
  name: string;
  order_num: number;
  lessons: MobileCourseLessonRes[];
}

export interface MobileCourseLessonRes {
  id: string;
  module_id: string;
  name: string;
  order_num: number;
  is_completed: boolean;
  is_public: boolean;
  content_types?: ContentType[];
}

export interface CoursePriceOption {
  tariff_id: string;
  duration: number;
  price: number;
}

// ============================================================================
// Lesson API Detail (SourceLessonMobile)
// ============================================================================

export interface SourceMobile {
  id: string;
  name: string;
  order_num: number;
  type: string;
  url: string;
  video_url?: string;
}

export interface SourceUpdateBody {
  id: string;
  name?: string;
  url?: string;
  video_url?: string;
  order_num?: number;
  file?: File;
}

export interface QuizSummary {
  id: string;
  title: string;
  time_limit_sec: number | null;
  question_count: number;
  best_percent: number | null;
}

export interface SourceLessonMobileRes {
  id: string;
  name: string;
  order_num: number;
  duration: number;
  is_completed: boolean;
  type: string;
  content_types?: ContentType[];
  videos: SourceMobile[];
  audios?: SourceMobile[];
  documents: SourceMobile[];
  quizzes?: QuizSummary[];
  tests: SourceMobile[];
}


// ============================================================================
// User Course Permission Types
// ============================================================================

export interface UserCourseMobileRes {
  id: string;
  course_id: string;
  course_name: string;
  course_image_url?: string;
  user_id: string;
  user_name: string;
  tariff_id: string;
  tariff_name: string;
  duration: number;
  percentage: number;
  total_lessons: number;
  completed_lessons: number;
  is_active: boolean;
  started_at: string;
  ended_at: string;
  created_at: string;
  updated_at: string;
}

export interface UserCourseMobileList {
  user_courses: UserCourseMobileRes[];
  count: number;
}

// ============================================================================
// Subject Types
// ============================================================================

export interface Subject {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  is_active: boolean;
  order_num?: number;
  total_courses?: number;
  /** @deprecated */
  package?: PremiumPackage | null;
  created_at: string;
  updated_at: string;
}

export interface SubjectList {
  subjects: Subject[];
  count: number;
}

// ============================================================================
// Banner Types
// ============================================================================

export interface BannerMobile {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  link_url?: string;
  order_num: number;
  created_at: string;
  updated_at: string;
}

export interface BannerMobileList {
  banners: BannerMobile[];
  count: number;
}

export interface BannerMobileRes {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  link_url?: string;
  order_num: number;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// About Types
// ============================================================================

export interface AboutMobile {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface AboutMobileList {
  about: AboutMobile[];
  count: number;
}

export interface AboutMobileRes {
  id: string;
  title: string;
  description: string;
  link_url?: string;
  order_num: number;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// FAQ Types
// ============================================================================

export interface FAQMobile {
  id: string;
  question: string;
  answer: string;
  order_num: number;
  created_at: string;
  updated_at: string;
}

export interface FAQList {
  faqs: FAQMobile[];
  count: number;
}

// ============================================================================
// Notification Types
// ============================================================================

export interface UserNotification {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  type?: string;
  course_id?: string;
  created_at: string;
  updated_at: string;
}

export interface UserNotificationList {
  notifications: UserNotification[];
  count: number;
}

export interface UserActivityCreateBody {
  activity: number;
}

export interface ActivityStatItem {
  date: string;
  value: number;
}

export interface ActivityStatsResponse {
  user_id: string;
  type: string;
  total: number;
  items: ActivityStatItem[];
}

export interface DashboardRes {
  active_promocodes: number;
  active_user_courses: number;
  active_users: number;
  admin_orders: number;
  cancelled_orders: number;
  click_orders: number;
  courses: number;
  deleted_user_courses: number;
  documents: number;
  inactive_user_courses: number;
  lessons: number;
  modules: number;
  paid_orders: number;
  promocodes: number;
  subjects: number;
  tariffs: number;
  teachers: number;
  tests: number;
  user_courses: number;
  users: number;
  videos: number;
}

export interface RatingUser {
  user_id: string;
  name: string;
  image_url?: string;
  rank: number;
  activity: number;
  score?: number;
  tests_count?: number;
  is_ustoz?: boolean;
  is_me?: boolean;
}

export interface RatingResponse {
  type: string;
  by?: 'activity' | 'test';
  limit: number;
  items: RatingUser[];
  me?: RatingUser;
}

// ============================================================================
// Tariff Types
// ============================================================================

export interface TariffRes {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number; // days
  features?: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TariffList {
  tariffs: TariffRes[];
  count: number;
}

// ============================================================================
// Order Types
// ============================================================================

export interface OrderCreateBody {
  tariff_id: string;
  course_id?: string;
  promocode_id?: string;
}

export interface OrderRes {
  id: string;
  user_id: string;
  tariff_id: string;
  amount: number;
  status: string;
  payment_url?: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// Contact Types
// ============================================================================

export interface ContactCreateBody {
  name: string;
  phone_number: string;
  message?: string;
}

export interface Contact {
  id: string;
  name: string;
  phone_number: string;
  message?: string;
  created_at: string;
  updated_at: string;
}

export interface ContactList {
  contacts: Contact[];
  count: number;
}

// ============================================================================
// App Route Types
// ============================================================================

export interface AppRoute {
  id: string;
  key: string;
  value: string;
  created_at: string;
  updated_at: string;
}

export interface AppRouteList {
  routes: AppRoute[];
  count: number;
}

export interface AppRouteRes {
  id: string;
  key: string;
  value: string;
  buy_course?: boolean;
  feedback_url?: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// API Response Wrapper
// ============================================================================

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// ============================================================================
// Query Parameters
// ============================================================================

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface CourseQueryParams extends PaginationParams {
  name?: string;
  subject_id?: string;
  is_public?: boolean;
}

export interface SubjectQueryParams extends PaginationParams {
  name?: string;
}

export interface NotificationQueryParams {
  is_read?: boolean;
}

export interface ActivityQueryParams {
  type: 'day' | 'week' | 'month' | 'year' | 'range';
  date?: string; // YYYY-MM-DD for day type
  from?: string; // YYYY-MM-DD for range type
  to?: string; // YYYY-MM-DD for range type
}

export interface RatingQueryParams {
  type?: 'day' | 'week' | 'month' | 'year' | 'total';
  by?: 'activity' | 'test';
  limit?: number;
}

// ============================================================================
// Language Type
// ============================================================================

export type Language = 'uz' | 'ru' | 'en';

export interface PromocodeReq {
  promocode: string;
  type?: 'premium' | string;
  subject_id?: string;
  tariff_id?: string;
  course_id?: string;
}

export interface PromocodeRes {
  is_valid: boolean;
  message: string;
  discount_type: 'percent' | 'fixed' | null;
  discount_value: number | null; // The percentage or fixed amount value
  tariff_id: string | null;
  course_id: string | null;
  promocode_id: string | null;
  course_amount: number | null; // Original price
  discount_amount: number | null; // Calculated discount amount
  total_amount: number | null; // Final price
}

// ============================================================================
// Quiz (in-app test)
// ============================================================================

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  text: string;
  image_url?: string | null;
  options: QuizOption[];
}

export interface QuizDetail {
  id: string;
  lesson_id: string;
  title: string;
  time_limit_sec: number | null;
  best_percent: number | null;
  questions: QuizQuestion[];
}

export interface QuizStartRes {
  attempt_id: string;
  started_at: string;
  time_limit_sec: number | null;
}

export interface QuizAnswerReq {
  question_id: string;
  option_id: string;
}

export interface QuizAnswerRes {
  is_correct: boolean;
  correct_option_id: string;
}

export interface QuizFinishRes {
  attempt_id: string;
  test_id: string;
  correct_count: number;
  total_count: number;
  percent: number;
  next_lesson_id: string | null;
}

// ============================================================================
// Premium
// ============================================================================

export interface PremiumPackageOffer {
  subject_id: string;
  name: string;
  image_url?: string;
  courses: string[];
  price: number;
  duration_months: number;
  is_active: boolean;
  until: string | null;
}

export interface PremiumRes {
  is_premium: boolean;
  premium_until: string | null;
  is_ustoz: boolean;
  packages: PremiumPackageOffer[];
}

export interface PremiumOrderBody {
  subject_id: string;
  promocode_id?: string;
}

export interface PremiumOrderRes {
  message: string;
  order_id: string;
  url?: string;
}

// ============================================================================
// Test history
// ============================================================================

export interface TestHistorySummary {
  tests_count: number;
  average_percent: number;
  best_percent: number;
}

export interface TestHistoryItem {
  test_id: string;
  test_title: string;
  lesson_id: string;
  course_id: string;
  course_name: string;
  best_percent: number;
  attempts: number;
  last_attempt_id: string;
  last_finished_at: string;
}

export interface TestHistoryRes {
  summary: TestHistorySummary;
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
  data: TestHistoryItem[];
}
