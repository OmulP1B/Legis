-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'OPERATOR', 'MODERATOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('INCOMPLET', 'IN_ASTEPTARE', 'APROBAT', 'DEZAPROBAT', 'STERS');

-- CreateEnum
CREATE TYPE "DocLegalStatus" AS ENUM ('IN_VIGOARE', 'ABROGAT', 'SUSPENDAT');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_types" (
    "id" SERIAL NOT NULL,
    "nameRo" TEXT NOT NULL,
    "nameRu" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "document_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emitents" (
    "id" SERIAL NOT NULL,
    "nameRo" TEXT NOT NULL,
    "nameRu" TEXT,
    "category" TEXT,
    "parentId" INTEGER,

    CONSTRAINT "emitents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "publication_statuses" (
    "id" SERIAL NOT NULL,
    "nameRo" TEXT NOT NULL,
    "nameRu" TEXT,

    CONSTRAINT "publication_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" SERIAL NOT NULL,
    "titleRo" TEXT NOT NULL,
    "titleRu" TEXT,
    "titlePrevRo" TEXT,
    "titlePrevRu" TEXT,
    "bodyRo" TEXT NOT NULL,
    "bodyRu" TEXT,
    "amendmentsRo" TEXT,
    "amendmentsRu" TEXT,
    "number" TEXT NOT NULL,
    "articleNumber" TEXT,
    "moNumber" TEXT,
    "dateIssued" TIMESTAMP(3) NOT NULL,
    "datePublished" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 1,
    "parentId" INTEGER,
    "status" "DocumentStatus" NOT NULL DEFAULT 'INCOMPLET',
    "legalStatus" "DocLegalStatus" NOT NULL DEFAULT 'IN_VIGOARE',
    "repealedById" INTEGER,
    "typeId" INTEGER NOT NULL,
    "emitentId" INTEGER NOT NULL,
    "publicationStatusId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" INTEGER,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorites" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "documentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_logs" (
    "id" SERIAL NOT NULL,
    "documentId" INTEGER NOT NULL,
    "userId" INTEGER,
    "action" TEXT NOT NULL,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_logs" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "action" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_constants" (
    "id" SERIAL NOT NULL,
    "keyName" TEXT NOT NULL,
    "valueRo" TEXT NOT NULL,
    "valueRu" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_constants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "refresh_tokens"("token");

-- CreateIndex
CREATE INDEX "refresh_tokens_token_idx" ON "refresh_tokens"("token");

-- CreateIndex
CREATE INDEX "refresh_tokens_userId_idx" ON "refresh_tokens"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "document_types_nameRo_key" ON "document_types"("nameRo");

-- CreateIndex
CREATE UNIQUE INDEX "publication_statuses_nameRo_key" ON "publication_statuses"("nameRo");

-- CreateIndex
CREATE INDEX "documents_number_idx" ON "documents"("number");

-- CreateIndex
CREATE INDEX "documents_typeId_idx" ON "documents"("typeId");

-- CreateIndex
CREATE INDEX "documents_emitentId_idx" ON "documents"("emitentId");

-- CreateIndex
CREATE INDEX "documents_status_idx" ON "documents"("status");

-- CreateIndex
CREATE INDEX "documents_legalStatus_idx" ON "documents"("legalStatus");

-- CreateIndex
CREATE INDEX "documents_dateIssued_idx" ON "documents"("dateIssued");

-- CreateIndex
CREATE INDEX "documents_parentId_idx" ON "documents"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "favorites_userId_documentId_key" ON "favorites"("userId", "documentId");

-- CreateIndex
CREATE INDEX "document_logs_documentId_idx" ON "document_logs"("documentId");

-- CreateIndex
CREATE INDEX "document_logs_userId_idx" ON "document_logs"("userId");

-- CreateIndex
CREATE INDEX "user_logs_userId_idx" ON "user_logs"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "system_constants_keyName_key" ON "system_constants"("keyName");

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "document_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_emitentId_fkey" FOREIGN KEY ("emitentId") REFERENCES "emitents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_publicationStatusId_fkey" FOREIGN KEY ("publicationStatusId") REFERENCES "publication_statuses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_logs" ADD CONSTRAINT "document_logs_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_logs" ADD CONSTRAINT "document_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_logs" ADD CONSTRAINT "user_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
