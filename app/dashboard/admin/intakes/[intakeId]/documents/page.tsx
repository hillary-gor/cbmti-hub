import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { generateSignedUrl, deleteFileDirect } from "./actions";

type PageProps = {
  params: Promise<{ intakeId: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

type SupabaseFileRecord = {
  id: string;
  file_name: string;
  file_path: string;
  category: string;
  uploaded_at: string;
  student: {
    id: string;
    full_name: string;
    reg_number: string;
    intake_id: string;
  } | null;
};

export default async function DocumentsPage({ params }: PageProps) {
  const awaitedParams = await params;
  const { intakeId } = awaitedParams;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("student_attachments")
    .select(
      `
      id,
      file_name,
      file_path,
      category,
      uploaded_at,
      student:students (
        id,
        full_name,
        reg_number,
        intake_id
      )
    `,
    )
    .order("uploaded_at", { ascending: false });

  if (error || !data) {
    notFound();
  }

  const typed = data as unknown as SupabaseFileRecord[];

  const filesForIntake = typed.filter((f) => f.student?.intake_id === intakeId);

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admission Documents</h1>
        <p className="text-sm text-muted-foreground">
          Uploaded files for students in this intake.
        </p>
      </div>

      {filesForIntake.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No uploaded documents yet.
        </p>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-2">Student</th>
                <th className="px-4 py-2">File</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Uploaded</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {await Promise.all(
                filesForIntake.map(async (file) => {
                  const url = await generateSignedUrl(file.file_path);
                  return (
                    <tr
                      key={file.id}
                      className="border-t hover:bg-muted/30 transition"
                    >
                      <td className="px-4 py-2">
                        {file.student?.reg_number} – {file.student?.full_name}
                      </td>
                      <td className="px-4 py-2">{file.file_name}</td>
                      <td className="px-4 py-2 capitalize">
                        {file.category.replace("_", " ")}
                      </td>
                      <td className="px-4 py-2 text-muted-foreground">
                        {new Date(file.uploaded_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 space-x-2 flex">
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          View
                        </a>

                        <form action={deleteFileDirect}>
                          <input type="hidden" name="id" value={file.id} />
                          <input
                            type="hidden"
                            name="filePath"
                            value={file.file_path}
                          />
                          <button
                            type="submit"
                            className="text-red-600 underline hover:text-red-700"
                            onClick={(e) => {
                              if (
                                !confirm(
                                  "Are you sure you want to delete this file?",
                                )
                              ) {
                                e.preventDefault();
                              }
                            }}
                          >
                            Delete
                          </button>
                        </form>
                      </td>
                    </tr>
                  );
                }),
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
