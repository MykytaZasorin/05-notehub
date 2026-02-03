// src/components/NoteForm/NoteForm.tsx
import { FC } from "react";
import { useFormik, FormikHelpers, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import css from "./NoteForm.module.css";
import { createNote, CreateNoteParams } from "../../services/noteService";

interface NoteFormProps {
  onCancel: () => void;
}

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be at most 50 characters")
    .required("Title is required"),
  content: Yup.string().max(500, "Content must be at most 500 characters"),
  tag: Yup.string()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
    .required("Tag is required"),
});

const NoteForm: FC<NoteFormProps> = ({ onCancel }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: CreateNoteParams) => createNote(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onCancel();
    },
  });

  const formik = useFormik<CreateNoteParams>({
    initialValues: {
      title: "",
      content: "",
      tag: "Todo",
    },
    validationSchema,
    onSubmit: (
      values: CreateNoteParams,
      helpers: FormikHelpers<CreateNoteParams>,
    ) => {
      mutation.mutate(values);
      helpers.resetForm();
    },
  });

  return (
    <form className={css.form} onSubmit={formik.handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          className={css.input}
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <ErrorMessage name="title" component="span" className={css.error} />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          value={formik.values.content}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <ErrorMessage name="content" component="span" className={css.error} />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          value={formik.values.tag}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
        <ErrorMessage name="tag" component="span" className={css.error} />
      </div>

      <div className={css.actions}>
        <button type="button" className={css.cancelButton} onClick={onCancel}>
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={mutation.status === "pending"}
        >
          {mutation.status === "pending" ? "Creating..." : "Create note"}
        </button>
      </div>
    </form>
  );
};

export default NoteForm;
