"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form"; 
import {
    attendanceSchema,
    AttendanceSchema,  
} from "@/lib/formValidationSchemas";
import {
    createAttendance,
    createEvent, 
  updateAttendance, 
  updateEvent,  
} from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import InputField from "../InputField";
 

const AttendanceForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AttendanceSchema>({
    resolver: zodResolver(attendanceSchema),
  });  
 

  // AFTER REACT 19 IT'LL BE USEACTIONSTATE

  const [state, formAction] = useFormState(
    type === "create" ? createAttendance : updateAttendance,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit((data) => {
    formAction(data);
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Attendance has been ${type === "create" ? "created" : "updated"}!`);
      router.refresh()
      setOpen(false); 
    }
  }, [state, router, type, setOpen]);
 

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new Attendance" : "Update the Attendance"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="lessonId"
          name="lessonId"
          defaultValue={data?.lessonId}
          register={register}
          error={errors?.lessonId}
        />
         <InputField
          label="Student Id"
          name="studentId"
          defaultValue={data?.studentId}
          register={register}
          error={errors?.studentId}
        />
{/*          
        <InputField
          label="Date"
          name="date"
          defaultValue={data?.date}
          register={register}
          error={errors?.date}
          type="datetime-local"
        /> */}
        
        {data && (
          <InputField
            label="Id"
            name="id"
            defaultValue={data?.id}
            register={register}
            error={errors?.id}
            hidden
          />
        )} 
<div className="flex flex-col gap-2 w-full md:w-1/4">
  <label className="text-xs text-gray-500">Day</label>
  <select
    className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
    {...register("present", {
      setValueAs: (value) => value === "true" // Convert string to boolean
    })}
    defaultValue={data?.day}
  >
    <option value="true"> TRUE </option>
    <option value="false"> FALSE </option>
  </select>
  {errors.present?.message && (
    <p className="text-xs text-red-400">
      {errors.present.message.toString()}
    </p>
  )}
</div> 
     
          
         
      </div>
      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}
      <button type="submit" className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default AttendanceForm;