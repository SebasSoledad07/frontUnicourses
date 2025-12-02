import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  getModuleContent,
  uploadFile,
  createFileContent,
  createLinkOrTextContent,
  deleteModuleContent,
  toggleContentVisibility,
  type ModuleContent,
} from "../../services/teacherService";
import Toast from "../Toast";

interface ToastMessage {
  type: "success" | "error" | "warning" | "info";
  message: string;
}

export default function ModuleContentManager() {
  const { cursoId, moduloId } = useParams<{
    cursoId: string;
    moduloId: string;
  }>();
  const location = useLocation();
  const moduloNombre = location.state?.moduloNombre || "Módulo";

  const [contents, setContents] = useState<ModuleContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [contentType, setContentType] = useState<
    "pdf" | "video" | "link" | "texto"
  >("pdf");
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    url: "",
    file: null as File | null,
  });

  useEffect(() => {
    if (moduloId) {
      loadContent();
    }
  }, [moduloId]);

  const loadContent = async () => {
    if (!moduloId) return;
    setLoading(true);
    try {
      const data = await getModuleContent(parseInt(moduloId));
      setContents(data);
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "Error al cargar contenido" });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setFormData({ titulo: "", descripcion: "", url: "", file: null });
    setContentType("pdf");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({ titulo: "", descripcion: "", url: "", file: null });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduloId || !cursoId) return;

    setUploading(true);
    try {
      if (contentType === "pdf" || contentType === "video") {
        if (!formData.file) {
          setToast({ type: "warning", message: "Selecciona un archivo" });
          setUploading(false);
          return;
        }

        // Subir archivo
        const fileUrl = await uploadFile(
          cursoId,
          parseInt(moduloId),
          formData.file
        );

        // Crear registro
        await createFileContent(
          parseInt(moduloId),
          contentType,
          formData.titulo,
          formData.descripcion,
          fileUrl,
          formData.file.name,
          formData.file.size
        );
      } else {
        // Contenido tipo link o texto
        await createLinkOrTextContent(
          parseInt(moduloId),
          contentType,
          formData.titulo,
          formData.descripcion,
          formData.url || undefined
        );
      }

      setToast({ type: "success", message: "Contenido agregado exitosamente" });
      await loadContent();
      handleCloseModal();
    } catch (err: any) {
      setToast({
        type: "error",
        message: err.message || "Error al agregar contenido",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (contentId: number) => {
    if (!confirm("¿Estás seguro de eliminar este contenido?")) return;

    try {
      await deleteModuleContent(contentId);
      setToast({ type: "success", message: "Contenido eliminado" });
      await loadContent();
    } catch (err: any) {
      setToast({ type: "error", message: err.message || "Error al eliminar" });
    }
  };

  const handleToggleVisible = async (content: ModuleContent) => {
    try {
      await toggleContentVisibility(content.id, !content.visible);
      await loadContent();
      setToast({
        type: "success",
        message: `Contenido ${!content.visible ? "publicado" : "ocultado"}`,
      });
    } catch (err: any) {
      setToast({
        type: "error",
        message: err.message || "Error al actualizar",
      });
    }
  };

  const getIcon = (tipo: string) => {
    switch (tipo) {
      case "pdf":
        return (
          <svg
            className="w-8 h-8 text-red-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm0 2h12v10H4V5z" />
          </svg>
        );
      case "video":
        return (
          <svg
            className="w-8 h-8 text-blue-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm12.553 1.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
          </svg>
        );
      case "link":
        return (
          <svg
            className="w-8 h-8 text-teal-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
        );
      case "texto":
        return (
          <svg
            className="w-8 h-8 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <svg
          className="animate-spin h-10 w-10 text-teal-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{moduloNombre}</h1>
          <p className="text-sm text-gray-600">
            Gestiona el contenido de este módulo
          </p>
        </div>

        <button
          onClick={handleOpenModal}
          className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm font-semibold shadow-sm hover:from-teal-600 hover:to-teal-700 transition-all"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Agregar contenido
        </button>
      </div>

      {/* Content list */}
      <div className="space-y-4">
        {contents.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <p className="text-gray-500 text-sm mb-4">
              No has agregado contenido a este módulo.
            </p>
            <button
              onClick={handleOpenModal}
              className="text-teal-600 hover:text-teal-700 font-medium text-sm"
            >
              Agregar el primer contenido →
            </button>
          </div>
        ) : (
          contents.map((content, index) => (
            <div
              key={content.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">{getIcon(content.tipo)}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
                      {index + 1}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {content.titulo}
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        content.visible
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-50 text-gray-700"
                      }`}
                    >
                      {content.visible ? "Visible" : "Oculto"}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      {content.tipo.toUpperCase()}
                    </span>
                  </div>

                  {content.descripcion && (
                    <p className="text-gray-600 text-sm mb-2">
                      {content.descripcion}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    {content.archivo_nombre && (
                      <span>📎 {content.archivo_nombre}</span>
                    )}
                    {content.archivo_size && (
                      <span>{formatFileSize(content.archivo_size)}</span>
                    )}
                    {content.url && content.tipo === "link" && (
                      <a
                        href={content.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-600 hover:underline"
                      >
                        Ver enlace →
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleVisible(content)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title={content.visible ? "Ocultar" : "Publicar"}
                  >
                    {content.visible ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>

                  {content.url &&
                    (content.tipo === "pdf" || content.tipo === "video") && (
                      <a
                        href={content.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                        title="Ver archivo"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    )}

                  <button
                    onClick={() => handleDelete(content.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal agregar contenido */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-4 rounded-t-2xl">
              <h3 className="text-xl font-bold text-white">
                Agregar contenido
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Tipo de contenido */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de contenido
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(["pdf", "video", "link", "texto"] as const).map((tipo) => (
                    <button
                      key={tipo}
                      type="button"
                      onClick={() => setContentType(tipo)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        contentType === tipo
                          ? "bg-teal-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {tipo.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Título */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título
                </label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) =>
                    setFormData({ ...formData, titulo: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Ej: Material de lectura - Capítulo 1"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) =>
                    setFormData({ ...formData, descripcion: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
                  placeholder="Describe este contenido..."
                />
              </div>

              {/* Campo según tipo */}
              {(contentType === "pdf" || contentType === "video") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Archivo
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept={contentType === "pdf" ? ".pdf" : "video/*"}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                  {formData.file && (
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.file.name} ({formatFileSize(formData.file.size)}
                      )
                    </p>
                  )}
                </div>
              )}

              {contentType === "link" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL del enlace
                  </label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) =>
                      setFormData({ ...formData, url: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="https://ejemplo.com/recurso"
                  />
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={uploading}
                  className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className={`px-6 py-2.5 rounded-lg font-medium transition-all text-white ${
                    uploading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-lg hover:shadow-xl"
                  }`}
                >
                  {uploading ? "Subiendo..." : "Agregar contenido"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
