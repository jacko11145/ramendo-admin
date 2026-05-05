export interface ApiResponse<T> {
  success: boolean
  data: T | null
  message: string | null
  errors: string[] | null
}

export interface PagedResult<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// ─── Auth ──────────────────────────────────────────────────────────────────

export type UserRole = 'Admin' | 'ShopOwner' | 'VIP' | 'User'

export interface UserSession {
  id: string
  email: string
  name: string
  image: string | null
  role: UserRole
  experiencePoints: number
  level: number
  isVip: boolean
  vipExpiry: string | null
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  user: UserSession
}

// ─── Admin Users ─────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string
  email: string
  name: string
  image: string | null
  role: UserRole
  experiencePoints: number
  level: number
  isVip: boolean
  vipExpiry: string | null
  isActive: boolean
  createdAt: string
  shopCount: number
  reviewCount: number
}

// ─── Admin Shops ─────────────────────────────────────────────────────────────

export interface BusinessHours {
  monday: DayHours | null
  tuesday: DayHours | null
  wednesday: DayHours | null
  thursday: DayHours | null
  friday: DayHours | null
  saturday: DayHours | null
  sunday: DayHours | null
}

export interface DayHours {
  isOpen: boolean
  isSplit: boolean
  open: string | null
  close: string | null
}

export interface NewsItem {
  title: string
  content: string
  startDate: string
  endDate: string
}

export interface OptionValue { id: number; value: string }
export interface OptionGroup {
  id: number
  name: string
  isRequired: boolean
  isMultiSelect: boolean
  values: OptionValue[]
}

export interface MenuItem {
  id: string
  name: string
  price: number
  description: string | null
  category: string | null
  customCategory: string | null
  isHighlight: boolean
  isLimited: boolean
  position: number
  optionGroups: OptionGroup[]
}

export interface AdminShop {
  id: string
  name: string
  city: string
  district: string
  detailAddress: string
  phone: string | null
  website: string | null
  instagram: string | null
  facebookPageId: string | null
  coverImage: string | null
  images: string[]
  types: string[]
  isVerified: boolean
  isActive: boolean
  googleRating: number
  rating: number
  reviewCount: number
  description: string | null
  businessHours: BusinessHours | null
  newsItems: NewsItem[]
  menuItems: MenuItem[]
  createdAt: string
}

export interface CreateUpdateShopDto {
  name: string
  city: string
  district: string
  detailAddress: string
  phone?: string
  website?: string
  instagram?: string
  facebookPageId?: string
  types: string[]
  description?: string
  googleRating?: number
  isVerified: boolean
  isActive: boolean
  businessHours?: BusinessHours
  newsItems?: NewsItem[]
}

// ─── Admin Reviews ────────────────────────────────────────────────────────────

export interface AdminReview {
  id: string
  shopGuid: string
  shopName: string
  userId: string
  userName: string
  rating: number
  visitDate: string
  comment: string | null
  createdAt: string
}

// ─── Admin Submissions ────────────────────────────────────────────────────────

export type SubmissionStatus = 'Pending' | 'Approved' | 'Rejected'

export interface AdminSubmission {
  id: string
  shopName: string
  city: string
  district: string
  address: string
  note: string | null
  status: SubmissionStatus
  submittedAt: string
  submittedByUserId: string
  submittedByName: string
  reviewedAt: string | null
  rejectionReason: string | null
}

// ─── Admin Invitation Codes ───────────────────────────────────────────────────

export interface InvitationCode {
  code: string
  isActive: boolean
  usedCount: number
  maxUses: number | null
  expiresAt: string | null
  createdAt: string
  createdByName: string
}

// ─── Admin Settings ────────────────────────────────────────────────────────────

export interface PermissionSettings {
  minLevelToReview: number
  minLevelToSubmitShop: number
  minLevelToFavorite: number
}

export interface RankingSettings {
  allowUser: boolean
  allowGoogle: boolean
  allowCombined: boolean
  defaultType: string
  userWeight: number
  googleWeight: number
  displayLimit: number
  minReviews: number
  minRating: number
  mustBeVerified: boolean
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

export interface DashboardStats {
  totalUsers: number
  totalShops: number
  totalReviews: number
  pendingSubmissions: number
  activeInvitationCodes: number
  newUsersThisMonth: number
  newReviewsThisMonth: number
}

// ─── Admin Database ──────────────────────────────────────────────────────────

export interface TableStats {
  tableName: string
  rowCount: number
  sizeKb: number
}
