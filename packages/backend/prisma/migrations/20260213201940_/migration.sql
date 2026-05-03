-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'WORKER', 'ADMIN');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ServiceRequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'REJECTED');

-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'APPROVED', 'FLAGGED', 'REMOVED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('SERVICE_REQUEST', 'REQUEST_ACCEPTED', 'REQUEST_REJECTED', 'REQUEST_COMPLETED', 'NEW_REVIEW', 'REVIEW_REMINDER', 'VERIFICATION_UPDATE', 'SYSTEM');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'VERIFY', 'MODERATE', 'BLOCK', 'UNBLOCK');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "email" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "passwordHash" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "avatarUrl" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "blockedReason" TEXT,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otp_verifications" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "otp_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "address" TEXT,
    "street" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'India',
    "postalCode" TEXT,
    "formattedAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "professions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "iconUrl" TEXT,
    "categoryGroup" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "professions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "worker_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bio" TEXT,
    "experience" INTEGER,
    "serviceRadius" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "hourlyRate" DECIMAL(10,2),
    "minimumCharge" DECIMAL(10,2),
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "verifiedAt" TIMESTAMP(3),
    "verifiedById" TEXT,
    "totalJobs" INTEGER NOT NULL DEFAULT 0,
    "completedJobs" INTEGER NOT NULL DEFAULT 0,
    "cancelledJobs" INTEGER NOT NULL DEFAULT 0,
    "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalReviews" INTEGER NOT NULL DEFAULT 0,
    "trustScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "emergencyAvailable" BOOLEAN NOT NULL DEFAULT false,
    "profileComplete" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "worker_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "worker_professions" (
    "id" TEXT NOT NULL,
    "workerId" TEXT NOT NULL,
    "professionId" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "yearsExperience" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "worker_professions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "availability_slots" (
    "id" TEXT NOT NULL,
    "workerId" TEXT NOT NULL,
    "dayOfWeek" "DayOfWeek" NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "availability_slots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "worker_documents" (
    "id" TEXT NOT NULL,
    "workerId" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "documentUrl" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "verifiedById" TEXT,
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "worker_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "worker_tags" (
    "id" TEXT NOT NULL,
    "workerId" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "isAutomatic" BOOLEAN NOT NULL DEFAULT true,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "worker_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_requests" (
    "id" TEXT NOT NULL,
    "requestNumber" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workerId" TEXT,
    "professionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "preferredDate" TIMESTAMP(3),
    "preferredTimeSlot" TEXT,
    "urgency" TEXT NOT NULL DEFAULT 'NORMAL',
    "serviceLatitude" DOUBLE PRECISION,
    "serviceLongitude" DOUBLE PRECISION,
    "serviceAddress" TEXT,
    "status" "ServiceRequestStatus" NOT NULL DEFAULT 'PENDING',
    "statusHistory" JSONB,
    "estimatedPrice" DECIMAL(10,2),
    "finalPrice" DECIMAL(10,2),
    "acceptedAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "cancellationReason" TEXT,
    "cancelledBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "service_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "serviceRequestId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "title" TEXT,
    "comment" TEXT,
    "status" "ReviewStatus" NOT NULL DEFAULT 'PENDING',
    "moderatedById" TEXT,
    "moderatedAt" TIMESTAMP(3),
    "moderationNote" TEXT,
    "isVerifiedPurchase" BOOLEAN NOT NULL DEFAULT true,
    "helpfulCount" INTEGER NOT NULL DEFAULT 0,
    "reportCount" INTEGER NOT NULL DEFAULT 0,
    "workerResponse" TEXT,
    "workerRespondedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorites" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workerId" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_logs" (
    "id" TEXT NOT NULL,
    "workerId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "previousStatus" "VerificationStatus",
    "newStatus" "VerificationStatus" NOT NULL,
    "performedById" TEXT,
    "notes" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verification_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "performedById" TEXT,
    "action" "AuditAction" NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "oldValue" JSONB,
    "newValue" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "data" JSONB,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feature_flags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "enabledCities" TEXT[],
    "enabledPercent" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feature_flags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_feature_flags" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "featureFlagId" TEXT NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_feature_flags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scheduled_jobs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "payload" JSONB,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "executedAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "error" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scheduled_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cache_invalidations" (
    "id" TEXT NOT NULL,
    "cacheKey" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "invalidatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cache_invalidations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_phone_idx" ON "users"("phone");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_isActive_isBlocked_idx" ON "users"("isActive", "isBlocked");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "refresh_tokens"("token");

-- CreateIndex
CREATE INDEX "refresh_tokens_userId_idx" ON "refresh_tokens"("userId");

-- CreateIndex
CREATE INDEX "refresh_tokens_token_idx" ON "refresh_tokens"("token");

-- CreateIndex
CREATE INDEX "refresh_tokens_expiresAt_idx" ON "refresh_tokens"("expiresAt");

-- CreateIndex
CREATE INDEX "otp_verifications_phone_otp_idx" ON "otp_verifications"("phone", "otp");

-- CreateIndex
CREATE INDEX "otp_verifications_expiresAt_idx" ON "otp_verifications"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "locations_userId_key" ON "locations"("userId");

-- CreateIndex
CREATE INDEX "locations_city_idx" ON "locations"("city");

-- CreateIndex
CREATE INDEX "locations_state_idx" ON "locations"("state");

-- CreateIndex
CREATE INDEX "locations_latitude_longitude_idx" ON "locations"("latitude", "longitude");

-- CreateIndex
CREATE UNIQUE INDEX "professions_name_key" ON "professions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "professions_slug_key" ON "professions"("slug");

-- CreateIndex
CREATE INDEX "professions_slug_idx" ON "professions"("slug");

-- CreateIndex
CREATE INDEX "professions_categoryGroup_idx" ON "professions"("categoryGroup");

-- CreateIndex
CREATE INDEX "professions_isActive_displayOrder_idx" ON "professions"("isActive", "displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "worker_profiles_userId_key" ON "worker_profiles"("userId");

-- CreateIndex
CREATE INDEX "worker_profiles_verificationStatus_idx" ON "worker_profiles"("verificationStatus");

-- CreateIndex
CREATE INDEX "worker_profiles_isAvailable_idx" ON "worker_profiles"("isAvailable");

-- CreateIndex
CREATE INDEX "worker_profiles_averageRating_idx" ON "worker_profiles"("averageRating");

-- CreateIndex
CREATE INDEX "worker_profiles_trustScore_idx" ON "worker_profiles"("trustScore");

-- CreateIndex
CREATE INDEX "worker_profiles_serviceRadius_idx" ON "worker_profiles"("serviceRadius");

-- CreateIndex
CREATE INDEX "worker_professions_professionId_idx" ON "worker_professions"("professionId");

-- CreateIndex
CREATE UNIQUE INDEX "worker_professions_workerId_professionId_key" ON "worker_professions"("workerId", "professionId");

-- CreateIndex
CREATE INDEX "availability_slots_workerId_dayOfWeek_idx" ON "availability_slots"("workerId", "dayOfWeek");

-- CreateIndex
CREATE INDEX "availability_slots_isActive_idx" ON "availability_slots"("isActive");

-- CreateIndex
CREATE INDEX "worker_documents_workerId_idx" ON "worker_documents"("workerId");

-- CreateIndex
CREATE INDEX "worker_documents_documentType_idx" ON "worker_documents"("documentType");

-- CreateIndex
CREATE INDEX "worker_tags_tag_idx" ON "worker_tags"("tag");

-- CreateIndex
CREATE UNIQUE INDEX "worker_tags_workerId_tag_key" ON "worker_tags"("workerId", "tag");

-- CreateIndex
CREATE UNIQUE INDEX "service_requests_requestNumber_key" ON "service_requests"("requestNumber");

-- CreateIndex
CREATE INDEX "service_requests_userId_idx" ON "service_requests"("userId");

-- CreateIndex
CREATE INDEX "service_requests_workerId_idx" ON "service_requests"("workerId");

-- CreateIndex
CREATE INDEX "service_requests_professionId_idx" ON "service_requests"("professionId");

-- CreateIndex
CREATE INDEX "service_requests_status_idx" ON "service_requests"("status");

-- CreateIndex
CREATE INDEX "service_requests_createdAt_idx" ON "service_requests"("createdAt");

-- CreateIndex
CREATE INDEX "service_requests_requestNumber_idx" ON "service_requests"("requestNumber");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_serviceRequestId_key" ON "reviews"("serviceRequestId");

-- CreateIndex
CREATE INDEX "reviews_targetId_status_idx" ON "reviews"("targetId", "status");

-- CreateIndex
CREATE INDEX "reviews_authorId_idx" ON "reviews"("authorId");

-- CreateIndex
CREATE INDEX "reviews_rating_idx" ON "reviews"("rating");

-- CreateIndex
CREATE INDEX "reviews_createdAt_idx" ON "reviews"("createdAt");

-- CreateIndex
CREATE INDEX "favorites_userId_idx" ON "favorites"("userId");

-- CreateIndex
CREATE INDEX "favorites_workerId_idx" ON "favorites"("workerId");

-- CreateIndex
CREATE UNIQUE INDEX "favorites_userId_workerId_key" ON "favorites"("userId", "workerId");

-- CreateIndex
CREATE INDEX "verification_logs_workerId_idx" ON "verification_logs"("workerId");

-- CreateIndex
CREATE INDEX "verification_logs_createdAt_idx" ON "verification_logs"("createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_entityType_entityId_idx" ON "audit_logs"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- CreateIndex
CREATE INDEX "notifications_userId_isRead_idx" ON "notifications"("userId", "isRead");

-- CreateIndex
CREATE INDEX "notifications_createdAt_idx" ON "notifications"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "feature_flags_name_key" ON "feature_flags"("name");

-- CreateIndex
CREATE INDEX "feature_flags_name_idx" ON "feature_flags"("name");

-- CreateIndex
CREATE INDEX "feature_flags_isEnabled_idx" ON "feature_flags"("isEnabled");

-- CreateIndex
CREATE UNIQUE INDEX "user_feature_flags_userId_featureFlagId_key" ON "user_feature_flags"("userId", "featureFlagId");

-- CreateIndex
CREATE INDEX "scheduled_jobs_type_status_idx" ON "scheduled_jobs"("type", "status");

-- CreateIndex
CREATE INDEX "scheduled_jobs_scheduledAt_idx" ON "scheduled_jobs"("scheduledAt");

-- CreateIndex
CREATE INDEX "cache_invalidations_cacheKey_idx" ON "cache_invalidations"("cacheKey");

-- CreateIndex
CREATE INDEX "cache_invalidations_invalidatedAt_idx" ON "cache_invalidations"("invalidatedAt");

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worker_profiles" ADD CONSTRAINT "worker_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worker_professions" ADD CONSTRAINT "worker_professions_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "worker_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worker_professions" ADD CONSTRAINT "worker_professions_professionId_fkey" FOREIGN KEY ("professionId") REFERENCES "professions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "availability_slots" ADD CONSTRAINT "availability_slots_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "worker_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worker_documents" ADD CONSTRAINT "worker_documents_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "worker_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worker_tags" ADD CONSTRAINT "worker_tags_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "worker_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_professionId_fkey" FOREIGN KEY ("professionId") REFERENCES "professions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_serviceRequestId_fkey" FOREIGN KEY ("serviceRequestId") REFERENCES "service_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification_logs" ADD CONSTRAINT "verification_logs_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "worker_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_performedById_fkey" FOREIGN KEY ("performedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_feature_flags" ADD CONSTRAINT "user_feature_flags_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_feature_flags" ADD CONSTRAINT "user_feature_flags_featureFlagId_fkey" FOREIGN KEY ("featureFlagId") REFERENCES "feature_flags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
