
import { z } from "zod";

// Utility for empty strings and transforms
const emptyToNull = (val) => (val === "" ? null : val);
const emptyToUndefined = (val) => (val === "" ? undefined : val);
const stringToNumber = (val) => (val === "" ? undefined : Number(val));

// --- User Schemas ---
export const createUserSchema = z.object({
    name: z.string().optional(),
    email: z.string().email("Invalid email address"),
    phone: z.string().nullable().optional(),
    roles: z.array(z.string()).min(1, "At least one role is required"),
});

export const updateUserRolesSchema = z.object({
    userId: z.string().min(1, "User is required"),
    roles: z.array(z.string()).min(1, "At least one role is required"),
});

export const resetPasswordSchema = z.object({
    userId: z.string().min(1, "User is required"),
    temporaryPassword: z.string().optional(),
});

export const updateUserStatusSchema = z.object({
    userId: z.string().min(1, "User is required"),
    status: z.enum(["ACTIVE", "INACTIVE"]),
});

// --- Tender Schemas ---
export const tenderCategorySchema = z.object({
    label: z.string().min(1, "Label is required"),
    description: z.string().nullable().optional(),
    order: z.preprocess(stringToNumber, z.number().optional()),
    slug: z.string().optional(),
});

export const updateTenderCategorySchema = tenderCategorySchema.extend({
    id: z.string().min(1),
});

export const tenderSchema = z.object({
    tenderNumber: z.string().min(1, "Tender Number is required"),
    title: z.string().min(1, "Title is required"),
    summary: z.string().nullable().optional(),
    status: z.enum(["OPEN", "UPCOMING", "CLOSED", "CANCELLED"]),
    categoryId: z.string().nullable().optional(),
    publishedAt: z.union([z.string(), z.date(), z.null()]).optional(),
    closingAt: z.union([z.string(), z.date(), z.null()]).optional(),
    contactEmail: z.union([z.string().email(), z.string().length(0), z.null(), z.undefined()]).optional().transform(emptyToNull),
    contactPhone: z.string().nullable().optional().transform(emptyToNull),
    isVisible: z.boolean().optional().default(true),
});

export const updateTenderSchema = tenderSchema.extend({
    id: z.string().min(1),
});

export const attachmentSchema = z.object({
    tenderId: z.string().min(1, "Tender is required"),
    label: z.string().nullable().optional(),
    mediaId: z.string().optional(),
    mediaUrl: z.string().optional(),
}).refine((data) => data.mediaId || data.mediaUrl, {
    message: "A file must be selected",
    path: ["mediaId"]
});

export const updateAttachmentSchema = attachmentSchema.pick({ label: true, mediaId: true, mediaUrl: true }).extend({
    id: z.string().min(1),
}).refine((data) => data.mediaId || data.mediaUrl, {
    message: "A file must be selected",
    path: ["mediaId"]
});


// --- Service Schemas ---
export const serviceCategorySchema = z.object({
    title: z.string().min(1, "Title is required"),
    summary: z.string().nullable().optional(),
    heroCopy: z.string().nullable().optional(),
    order: z.preprocess(stringToNumber, z.number().optional()),
    slug: z.string().optional(),
});

export const updateServiceCategorySchema = serviceCategorySchema.extend({
    id: z.string().min(1),
});

export const serviceCardSchema = z.object({
    categoryId: z.string().min(1, "Category is required"),
    title: z.string().min(1, "Title is required"),
    summary: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    iconKey: z.string().optional(),
    gradientClass: z.string().optional(),
    order: z.preprocess(stringToNumber, z.number().optional()),
    mediaId: z.string().optional(),
});

export const updateServiceCardSchema = serviceCardSchema.extend({
    id: z.string().min(1),
});

export const serviceDetailSchema = z.object({
    serviceCardId: z.string().min(1, "Service Card is required"),
    heading: z.string().min(1, "Heading is required"),
    body: z.string().nullable().optional(),
    bulletPoints: z.union([z.string(), z.array(z.string())]).optional().transform((val) => {
        if (Array.isArray(val)) return val;
        if (typeof val === "string") {
            return val.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
        }
        return [];
    }),
    order: z.preprocess(stringToNumber, z.number().optional()),
});

export const updateServiceDetailSchema = serviceDetailSchema.omit({ serviceCardId: true }).extend({
    id: z.string().min(1),
    serviceCardId: z.string().optional(), // Make optional for updates if not changing parent?
});

export const serviceResourceSchema = z.object({
    categoryId: z.string().min(1, "Category is required"),
    title: z.string().min(1, "Title is required"),
    description: z.string().nullable().optional(),
    externalUrl: z.union([z.string().url(), z.string().length(0), z.null(), z.undefined()]).optional().transform(emptyToNull),
    mediaId: z.string().optional(),
    mediaUrl: z.string().optional(),
}).refine((data) => data.mediaId || data.mediaUrl || data.externalUrl, {
    message: "Must provide either a file or an external URL",
    path: ["mediaId"]
});

export const updateServiceResourceSchema = serviceResourceSchema.extend({
    id: z.string().min(1),
}).refine((data) => data.mediaId || data.mediaUrl || data.externalUrl, {
    message: "Must provide either a file or an external URL",
    path: ["mediaId"]
});

export const deleteSchema = z.object({
    id: z.string().min(1, "ID is required"),
});
