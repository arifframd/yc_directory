"use client";
import React, { useActionState, useState } from "react";
import { Input } from "./input";
import { Textarea } from "./textarea";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "./button";
import { Send } from "lucide-react";
import { formSchema } from "@/lib/validation";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { createStartup } from "@/lib/actions";
import { useRouter } from "next/navigation";

const StartupForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({}); // untuk menyimpan error yang ada di form

  // untuk menampilkan pitch
  const [pitch, setPitch] = useState("");

  // untuk menampilkan toast
  const { toast } = useToast();

  const router = useRouter();

  // untuk menghandle submit form
  const handleFormSubmit = async (prevState: any, formData: FormData) => {
    const formValues = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      link: formData.get("link") as string,
      pitch,
    };
    try {
      await formSchema.parseAsync(formValues); // validasi form menggunakan zod

      const result = await createStartup(prevState, formData, pitch); // create startup
      console.log("result dari startup: ", result);

      if (result.status === "SUCCESS") {
        toast({
          title: "Success",
          description: "Your startup has been submitted",
          variant: "default",
        });

        router.push(`/startup/${result._id}`); // redirect ke halaman startup yang baru saja dibuat, pake router.push karena ini adalah client component
      }

      console.log(formValues);
      return result;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors; // ambil error dari zod
        setErrors(fieldErrors as unknown as Record<string, string>); // set error ke state

        toast({
          title: "Error",
          description: "Please check your input",
          variant: "destructive",
        });

        return {
          ...prevState,
          error: "Validation Invalid",
          status: "ERROR",
          field: {
            title: formValues.title,
            description: formValues.description,
            category: formValues.category,
            link: formValues.link,
          },
        }; // kembalikan state error
      }
      toast({
        title: "Error",
        description: "Unexpected error",
        variant: "destructive",
      });
      return {
        ...prevState,
        error: "Something went wrong",
        status: "ERROR",
        field: {
          title: formValues.title,
          description: formValues.description,
          category: formValues.category,
          link: formValues.link,
        },
      }; // kembalikan state error jika bukan zod
    }
  };

  // menggunakan useActionState untuk menghandle state dari form
  const [state, formAction, isPending] = useActionState(handleFormSubmit, {
    error: "",
    status: "INITIAL",
    field: {
      title: "",
      description: "",
      category: "",
      link: "",
    },
  });

  console.log(state);
  return (
    <form action={formAction} className="startup-form">
      <div>
        {/* Tittle */}
        <label htmlFor="title" className="startup-form_label">
          Title
        </label>
        <Input id="title" name="title" className="startup-form_input mb-5" required placeholder="Startup Title" defaultValue={state.field.title} />
        {errors.title && <p className="text-red-500">{errors.title}</p>}

        {/* Description */}
        <label htmlFor="description" className="startup-form_label">
          Description
        </label>
        <Textarea id="description" name="description" className="startup-form_textarea mb-5" required placeholder="Startup Description" defaultValue={state.field.description} />
        {errors.description && <p className="text-red-500">{errors.description}</p>}

        {/* Category */}
        <label htmlFor="category" className="startup-form_label">
          Category
        </label>
        <Input id="category" name="category" className="startup-form_input mb-5" required placeholder="Startup Category (Tech, Nature, Education...)" defaultValue={state.field.category} />
        {errors.category && <p className="text-red-500">{errors.category}</p>}

        {/* Image Link */}
        <label htmlFor="link" className="startup-form_label">
          Image URL
        </label>
        <Input id="link" name="link" className="startup-form_input mb-5" required placeholder="Startup Image URL" defaultValue={state.field.link} />
        {errors.link && <p className="text-red-500">{errors.link}</p>}

        {/* Pitch */}
        <label htmlFor="pitch" className="startup-form_label">
          Pitch
        </label>
        <MDEditor value={pitch} onChange={(value) => setPitch(value as string)} id="pitch" preview="edit" style={{ borderRadius: 15 }} textareaProps={{ placeholder: "Describe your idea" }} />
        {errors.pitch && <p className="text-red-500">{errors.pitch}</p>}
      </div>

      <Button type="submit" className="startup-form_btn text-white" disabled={isPending}>
        {isPending ? "Loading..." : "Submit Your Startup"} <Send className="size-10 ml-2" />
      </Button>
    </form>
  );
};

export default StartupForm;
