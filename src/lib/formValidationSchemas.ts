import { title } from "process";
import { Resolver } from "react-hook-form";
import { any, date, z, ZodError, ZodSchema } from "zod";



export const entriesSchema = z.object({
  id: z.coerce.number().optional(),
  FieldValue: z.any().optional(),
  fieldName: z.any(),
  CustomFieldId: z.coerce.number(),
  moduleType: z.enum(["Student", "Teacher", "Parent", "Subject", "Classes", "Exam", "Assignment", "Event", "Announcement", "Lesson"], { message: "Invalid module type!" }).optional(),
  teacherId: z.coerce.string().optional(),
  studentId: z.coerce.string().optional(),
  parentId: z.coerce.string().optional(),
  isRequired: z.coerce.boolean().optional()
})

export const subjectSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Subject name is required!" }),
  teachers: z.array(z.string()), //teacher ids
  Entries: z
    .array(entriesSchema)
    .optional()
    .superRefine((entries, ctx) => {
      entries?.forEach((entry, index) => {

        if (entry.CustomFieldId !== undefined) {

          console.log("MY DATA : : : ", entry.CustomFieldId, entry)
          const Changed = String(entry.FieldValue)
          if (entry.isRequired && (!entry.FieldValue || Changed.trim() === "")) {
            ctx.addIssue({
              path: [`e${[entry.CustomFieldId]}`],
              message: "Field value is Required for this entry",
              code: z.ZodIssueCode.custom, // Added this line
            });
          }
        } else {
          console.log(`Skipping entry at index ${index} because id is undefined.`);
        }
      });
    })
});

export type SubjectSchema = z.infer<typeof subjectSchema>;

export const classSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Subject name is required!" }),
  capacity: z.coerce.number().min(1, { message: "Capacity name is required!" }),
  gradeId: z.coerce.number().min(1, { message: "Grade name is required!" }),
  supervisorId: z.coerce.string().optional(),
  Entries: z
    .array(entriesSchema)
    .optional()
    .superRefine((entries, ctx) => {
      entries?.forEach((entry, index) => {

        if (entry.CustomFieldId !== undefined) {
          const Changed = String(entry.FieldValue)
          if (entry.isRequired && (!entry.FieldValue || Changed.trim() === "")) {
            ctx.addIssue({
              path: [`e${[entry.CustomFieldId]}`],
              message: "Field value is Required for this entry",
              code: z.ZodIssueCode.custom, // Added this line
            });
          }
        } else {
          console.log(`Skipping entry at index ${index} because id is undefined.`);
        }
      });
    })
});


export type ClassSchema = z.infer<typeof classSchema>;


export const customFieldSchema = z.object({
  id: z.coerce.number().optional(),
  fieldName: z
    .string()
    .min(1, { message: "Custom field name is required!" }).optional(),
  fieldType: z.enum(["TEXT", "INT", "DATE", "BOOLEAN", "SELECT", "FILE"], { message: "Invalid field type!" }).optional(),
  fieldValue: z.string().optional(),
  description: z.string().optional(),
  isRequired: z.boolean().optional(),
  moduleType: z.enum(["Student", "Teacher", "Parent", "Subject", "Classes", "Exam", "Assignment", "Event", "Announcement", "Lesson"], { message: "Invalid module type!" }).optional(),
  Options: z.array(z.coerce.string()).optional(),
  isDeleted: z.coerce.boolean().optional(),
  isTemp: z.coerce.boolean().optional()
});
export type CustomFieldSchema = z.infer<typeof customFieldSchema>;


export const arrayOfCustomFields = z.array(customFieldSchema).superRefine((entries, ctx) => {
  entries?.forEach((entry, index) => {

    // Validate only entries with `id` defined
    console.log("==========", entry)
    if (entry.fieldName !== undefined) {


      if ((!entry.fieldName || entry.fieldName.trim() === "")) {

        if (entry.id === undefined) {
          ctx.addIssue({
            path: [`e${[0]}`],
            message: "Field value is Required for this entry",
            code: z.ZodIssueCode.custom, // Added this line
          })
        }
        else {
          ctx.addIssue({
            path: [`e${[entry.id]}`],
            message: "Field value is Required for this entry",
            code: z.ZodIssueCode.custom, // Added this line
          });
        }

      }


    } else {
      console.log(`Skipping entry at index ${index} because id is undefined.`);
    }
  });
})
export type ArrayOfCustomFields = z.infer<typeof arrayOfCustomFields>





export type EntriesSchema = z.infer<typeof entriesSchema>;


export const teacherSchema = z.object({
  id: z.string().optional(), // Optional ID for updates
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" })
    .optional()
    .or(z.literal("")), // Allow empty string if no password is provided
  name: z.string().min(1, { message: "First name is required!" }),
  surname: z.string().min(1, { message: "Last name is required!" }),
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .optional()
    .or(z.literal("")), // Allow empty email if not provided
  phone: z.string().optional(),
  address: z.string(),
  img: z.string().optional(),
  bloodType: z.string().min(1, { message: "Blood Type is required!" }),
  birthday: z.coerce.date({ message: "Birthday is required!" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
  subjects: z.array(z.string()).optional(), // Array of subject IDs
  Entries: z
    .array(entriesSchema)
    .optional()
    .superRefine((entries, ctx) => {
      entries?.forEach((entry, index) => {

        // Validate only entries with `id` defined


        if (entry.CustomFieldId !== undefined) {

          console.log("MY DATA : : : ", entry.CustomFieldId, entry, entry.FieldValue)

          const Changed = String(entry.FieldValue)
          if (entry.isRequired && (!entry.FieldValue || Changed.trim() === "")) {
            ctx.addIssue({
              path: [`e${[entry.CustomFieldId]}`],
              message: "Field value is Required for this entry",
              code: z.ZodIssueCode.custom, // Added this line
            });
          }
        } else {
          console.log(`Skipping entry at index ${index} because id is undefined.`);
        }
      });
    })
});
export type TeacherSchema = z.infer<typeof teacherSchema>;


export const studentSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" })
    .optional()
    .or(z.literal("")),
  name: z.string().min(1, { message: "First name is required!" }),
  surname: z.string().min(1, { message: "Last name is required!" }),
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
  address: z.string(),
  img: z.string().optional(),
  bloodType: z.string().min(1, { message: "Blood Type is required!" }),
  birthday: z.coerce.date({ message: "Birthday is required!" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
  gradeId: z.coerce.number().min(1, { message: "Grade is required!" }),
  classId: z.coerce.number().min(1, { message: "Class is required!" }),
  parentId: z.string().min(1, { message: "Parent Id is required!" }),
  Entries: z
    .array(entriesSchema)
    .optional()
    .superRefine((entries, ctx) => {
      entries?.forEach((entry, index) => {

        // Validate only entries with `id` defined

        if (entry.CustomFieldId !== undefined) {
          const Changed = String(entry.FieldValue)
          if (entry.isRequired && (!entry.FieldValue || Changed.trim() === "")) {
            ctx.addIssue({
              path: [`e${[entry.CustomFieldId]}`],
              message: "Field value is Required for this entry",
              code: z.ZodIssueCode.custom, // Added this line
            });
          }
        } else {
          console.log(`Skipping entry at index ${index} because id is undefined.`);
        }
      });
    })
});

export type StudentSchema = z.infer<typeof studentSchema>;

export const examSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: "Title name is required!" }),
  startTime: z.coerce.date({ message: "Start time is required!" }).optional(),
  endTime: z.coerce.date({ message: "End time is required!" }).optional(),
  lessonId: z.coerce.number({ message: "Lesson is required!" }),
  Entries: z
    .array(entriesSchema)
    .optional()
    .superRefine((entries, ctx) => {
      entries?.forEach((entry, index) => {

        if (entry.CustomFieldId !== undefined) {

          console.log("MY DATA : : : ", entry.CustomFieldId, entry)
          const Changed = String(entry.FieldValue)
          if (entry.isRequired && (!entry.FieldValue || Changed.trim() === "")) {
            ctx.addIssue({
              path: [`e${[entry.CustomFieldId]}`],
              message: "Field value is Required for this entry",
              code: z.ZodIssueCode.custom, // Added this line
            });
          }
        } else {
          console.log(`Skipping entry at index ${index} because id is undefined.`);
        }
      });
    })
})

export type ExamSchema = z.infer<typeof examSchema>;


export const eventSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: "Title name is required!" }),
  description: z.string().min(1, { message: "description name is required!" }),

  startTime: z.coerce.date({ message: "Start time is required!" }),
  endTime: z.coerce.date({ message: "End time is required!" }),
  classId: z.coerce.number().optional(),
  Entries: z
    .array(entriesSchema)
    .optional()
    .superRefine((entries, ctx) => {
      entries?.forEach((entry, index) => {

        if (entry.CustomFieldId !== undefined) {

          console.log("MY DATA : : : ", entry.CustomFieldId, entry)
          const Changed = String(entry.FieldValue)

          if (entry.isRequired && (!entry.FieldValue || Changed.trim() === "")) {
            ctx.addIssue({
              path: [`e${[entry.CustomFieldId]}`],
              message: "Field value is Required for this entry",
              code: z.ZodIssueCode.custom, // Added this line
            });
          }
        } else {
          console.log(`Skipping entry at index ${index} because id is undefined.`);
        }
      });
    })
})

export type EventSchema = z.infer<typeof eventSchema>;


export const lessonSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.coerce.string().min(3, "Name should be long"),
  day: z.coerce.string(),
  teacherId: z.coerce.string(),
  subjectId: z.coerce.string(),
  classId: z.coerce.string(),
  startTime: z.coerce.date({ message: "Start time is required!" }),
  endTime: z.coerce.date({ message: "End time is required!" }),
  subjects: z.array(z.string()).optional(), // subject ids
  Entries: z
    .array(entriesSchema)
    .optional()
    .superRefine((entries, ctx) => {
      entries?.forEach((entry, index) => {

        if (entry.CustomFieldId !== undefined) {

          console.log("MY DATA : : : ", entry.CustomFieldId, entry)
          const Changed = String(entry.FieldValue)

          if (entry.isRequired && (!entry.FieldValue || Changed.trim() === "")) {
            ctx.addIssue({
              path: [`e${[entry.CustomFieldId]}`],
              message: "Field value is Required for this entry",
              code: z.ZodIssueCode.custom, // Added this line
            });
          }
        } else {
          console.log(`Skipping entry at index ${index} because id is undefined.`);
        }
      });
    })
}).refine(
  (values) => {
    const { startTime, endTime } = values;
    if (!startTime || !endTime) return false; // Ensure both times are present
    const start = new Date(startTime);
    const end = new Date(endTime);

    // Check if the end time is on the same date as the start time
    const sameDate = start.toDateString() === end.toDateString();

    // Calculate the difference in milliseconds
    const diffInMs = end.getTime() - start.getTime();
    const diffInMinutes = diffInMs / (1000 * 60); // Convert to minutes

    return diffInMinutes > 30 && diffInMinutes < 180; // 3 hours
  },
  {
    message: "Lesson duration must be between 30 minutes and 3 hours.",
    path: ["endTime"],
  }
)

export type LessonSchema = z.infer<typeof lessonSchema>

export const announcementSchema = z.object({

  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: "Title name is required!" }),
  description: z.string().min(1, { message: "description name is required!" }),
  date: z.coerce.date({ message: "Date is required!" }),
  classId: z.coerce.number().optional(),
  Entries: z
    .array(entriesSchema)
    .optional()
    .superRefine((entries, ctx) => {
      entries?.forEach((entry, index) => {

        if (entry.CustomFieldId !== undefined) {

          console.log("MY DATA : : : ", entry.CustomFieldId, entry)
          const Changed = String(entry.FieldValue)

          if (entry.isRequired && (!entry.FieldValue || Changed.trim() === "")) {
            ctx.addIssue({
              path: [`e${[entry.CustomFieldId]}`],
              message: "Field value is Required for this entry",
              code: z.ZodIssueCode.custom, // Added this line
            });
          }
        } else {
          console.log(`Skipping entry at index ${index} because id is undefined.`);
        }
      });
    })

})

export type AnnouncementSchema = z.infer<typeof announcementSchema>

export const parentSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" })
    .optional()
    .or(z.literal("")),
  name: z.string().min(1, { message: "First name is required!" }),
  surname: z.string().min(1, { message: "Last name is required!" }),
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
  address: z.string(),
  students: z.array(z.string()).optional(),
  Entries: z
    .array(entriesSchema)
    .optional()
    .superRefine((entries, ctx) => {
      entries?.forEach((entry, index) => {

        // Validate only entries with `id` defined

        if (entry.CustomFieldId !== undefined) {

          const Changed = String(entry.FieldValue)

          if (entry.isRequired && (!entry.FieldValue || Changed.trim() === "")) {
            ctx.addIssue({
              path: [`e${[entry.CustomFieldId]}`],
              message: "Field value is Required for this entry",
              code: z.ZodIssueCode.custom, // Added this line
            });
          }
        } else {
          console.log(`Skipping entry at index ${index} because id is undefined.`);
        }
      });
    })
});


export type ParentSchema = z.infer<typeof parentSchema>

export const attendanceSchema = z.object({
  id: z.coerce.number().optional(),
  date: z.coerce.date().optional(),
  present: z.boolean(),
  studentId: z.coerce.string(),
  lessonId: z.coerce.number({ message: "Lesson is required!" }),
})

export type AttendanceSchema = z.infer<typeof attendanceSchema>


export const assignmentSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.coerce.string().min(1, "Title is required!"),
  startDate: z.coerce.date({ message: "Start date is required!" }).optional(),
  dueDate: z.coerce.date({ message: "Due date is required!" }),
  lessonId: z.coerce.number({ message: "Lesson is required!" }),
  Entries: z
    .array(entriesSchema)
    .optional()
    .superRefine((entries, ctx) => {
      entries?.forEach((entry, index) => {

        if (entry.CustomFieldId !== undefined) {

          console.log("MY DATA : : : ", entry.CustomFieldId, entry)
          const Changed = String(entry.FieldValue)

          if (entry.isRequired && (!entry.FieldValue || Changed.trim() === "")) {
            ctx.addIssue({
              path: [`e${[entry.CustomFieldId]}`],
              message: "Field value is Required for this entry",
              code: z.ZodIssueCode.custom, // Added this line
            });
          }
        } else {
          console.log(`Skipping entry at index ${index} because id is undefined.`);
        }
      });
    })
})

export type AssignmentSchema = z.infer<typeof assignmentSchema>

export const resultSchema = z.object({
  id: z.coerce.number().optional(),
  score: z.coerce.number().min(0, "score must be positive").max(100, "score cant be greater than 100"),
  // ... existing code ...
  examId: z.coerce.number().optional(),
  Id: z.coerce.number().optional(),
  assessmentId: z.coerce.number(),
  studentId: z.coerce.string({ message: "Student id is required" }),

  // ... existing code ...
})
export type ResultSchema = z.infer<typeof resultSchema>


export const customZodResolver =
  (schema: ZodSchema): Resolver<any> =>
    async (values) => {
      try {
        // Filter and validate only entries with `id`

        const data = {
          ...values,
          Entries: values.Entries?.filter((entry: any) => entry.CustomFieldId !== undefined),
        };



        schema.parse(data); // Validate the filtered data

        console.log("data ======================", data)
        return { values: data, errors: {} };
      } catch (err) {
        console.log("err ", err)
        if (err instanceof ZodError) {
          const formErrors = err.errors.reduce((acc, error) => {

            const path = error.path.join(".");
            acc[path] = {
              type: "validation",
              message: error.message,
            };
            return acc;
          }, {} as Record<string, any>);


          return { values: {}, errors: formErrors };
        }


        // Return generic errors for unexpected issues
        return { values: {}, errors: { general: { type: "error", message: "Validation failed" } } };
      }
    };




export const customFieldZodResolver =
  (schema: ZodSchema): Resolver<any> =>
    async (values) => {
      try {
        // Filter and validate only entries with `id` 
        const data = {
          ...values,
          customFields: values.customFields?.filter((entry: any) => entry.fieldName !== undefined),
        };



        schema.parse(data); // Validate the filtered data

        console.log("data , ", data)
        return { values: data, errors: {} };
      } catch (err) {
        console.log("err ", err)
        if (err instanceof ZodError) {
          const formErrors = err.errors.reduce((acc, error) => {

            const path = error.path.join(".");
            acc[path] = {
              type: "validation",
              message: error.message,
            };
            return acc;
          }, {} as Record<string, any>);


          return { values: {}, errors: formErrors };
        }


        // Return generic errors for unexpected issues
        return { values: {}, errors: { general: { type: "error", message: "Validation failed" } } };
      }
    };
