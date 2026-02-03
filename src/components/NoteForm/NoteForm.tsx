import { FC } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from "@tanstack/react-query";
import { createNote, CreateNoteParams } from "../../services/noteService";
import { Note } from "../../types/note";
import css from "./NoteForm.module.css";

interface NoteFormProps {
  onCancel: () => void;
}

const validationSchema = Yup.object({
  title: Yup.string().min(3).max(50).required("Title is required"),
  content: Yup.string().max(500, "Content too long"),
  tag: Yup.string()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
    .required("Tag is required"),
});

const NoteForm: FC<NoteFormProps> = ({ onCancel }) => {
  const queryClient = useQueryClient();

  const mutation: UseMutationResult<Note, Error, CreateNoteParams, unknown> =
    useMutation({
      mutationFn: createNote,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["notes"] });
        onCancel();
      },
    });

  const formik = useFormik<CreateNoteParams>({
    initialValues: { title: "", content: "", tag: "Todo" },
    validationSchema,
    onSubmit: (values) => mutation.mutate(values),
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
          onChange={formik.handleChange}
          value={formik.values.title}
        />
        {formik.touched.title && formik.errors.title && (
          <span className={css.error}>{formik.errors.title}</span>
        )}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          onChange={formik.handleChange}
          value={formik.values.content}
        />
        {formik.touched.content && formik.errors.content && (
          <span className={css.error}>{formik.errors.content}</span>
        )}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          onChange={formik.handleChange}
          value={formik.values.tag}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
        {formik.touched.tag && formik.errors.tag && (
          <span className={css.error}>{formik.errors.tag}</span>
        )}
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
