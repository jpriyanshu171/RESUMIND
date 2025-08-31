"use client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

const WipeApp = () => {
  const { auth, isLoading, error, fs, kv } = usePuterStore();
  const navigate = useNavigate();
  const [files, setFiles] = useState<FSItem[]>([]);

  const loadFiles = async () => {
    const files = (await fs.readDir("./")) as FSItem[];
    setFiles(files);
  };

  useEffect(() => {
    loadFiles();
  }, []);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate("/auth?next=/wipe");
    }
  }, [isLoading]);

  const handleDelete = async () => {
    for (const file of files) {
      await fs.delete(file.path);
    }
    await kv.flush();
    loadFiles();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading App Data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen px-[12%] py-16 font-ovo">
      <h2 className="text-4xl font-bold text-center mb-6 text-gray-800">
        Wipe App Data
      </h2>
      <h4 className="text-center text-lg text-gray-600 mb-12">
        Manage and remove your stored files safely
      </h4>

      <div className="flex flex-col gap-6 max-w-3xl mx-auto">
        {/* Files List */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-300 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4">Existing Files</h3>
          {files.length === 0 ? (
            <p className="text-gray-600">No files found.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {files.map((file) => (
                <li
                  key={file.id}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {file.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Delete Button */}
        <div className="text-center">
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-6 py-3 rounded-xl shadow-md hover:bg-red-600 transition-colors"
          >
            Wipe App Data
          </button>
        </div>

        {/* Auth Info */}
        <p className="text-center text-gray-600 mt-4">
          Authenticated as:{" "}
          <span className="font-semibold text-gray-800">
            {auth.user?.username}
          </span>
        </p>
      </div>
    </main>
  );
};

export default WipeApp;
