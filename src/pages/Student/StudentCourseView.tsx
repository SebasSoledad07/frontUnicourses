import { useEffect, useState } from "react";
import supabase from "../../utils/supabase";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

// ... imports existentes
interface Curso {
  id: number;
  nombre: string;
  descripcion: string;
  profesor_asignado: string;
  fecha_creacion: string;
  activo: boolean;
  cupo_maximo: number;
  cupos_ocupados?: number; // nuevo campo
}

export default function StudentCoursesView() {
  const [matriculados, setMatriculados] = useState<Curso[]>([]);
  const [disponibles, setDisponibles] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCurso, setSelectedCurso] = useState<Curso | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [matriculando, setMatriculando] = useState(false);

  useEffect(() => {
    fetchCursos();
  }, []);

  const fetchCursos = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    // Cursos matriculados
    const { data: cursosMatriculados } = await supabase
      .from("matriculas")
      .select(
        `
        curso_id,
        cursos (
          id,
          nombre,
          descripcion,
          profesor_asignado,
          fecha_creacion,
          activo,
          cupo_maximo
        )
      `
      )
      .eq("perfil_id", user.id); // corregido: era .eq("id", user.id)

    const cursosMat: Curso[] = cursosMatriculados
      ? cursosMatriculados.flatMap((m) => m.cursos)
      : [];

    // IDs de cursos ya matriculados
    const matriculadosIds = cursosMat.map((c) => c.id);

    // Obtener todos los cursos activos
    const { data: cursosDisponibles } = await supabase
      .from("cursos")
      .select("*")
      .eq("activo", true);

    const disponiblesConCupo = await Promise.all(
      (cursosDisponibles || [])
        .filter((c) => !matriculadosIds.includes(c.id))
        .map(async (curso) => {
          const { count } = await supabase
            .from("matriculas")
            .select("*", { count: "exact", head: true })
            .eq("curso_id", curso.id);

          return { ...curso, cupos_ocupados: count ?? 0 };
        })
    );

    setMatriculados(cursosMat);
    setDisponibles(disponiblesConCupo);
    setLoading(false);
  };

  const handleOpenModal = (curso: Curso) => {
    setSelectedCurso(curso);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCurso(null);
  };

  const handleMatricular = async (cursoId: number) => {
    setMatriculando(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMatriculando(false);
      alert("Debes iniciar sesión.");
      return;
    }

    const { error } = await supabase.from("matriculas").insert({
      perfil_id: user.id,
      curso_id: cursoId,
    });

    if (error) {
      alert("Error al matricular: " + error.message);
    } else {
      alert("Matriculado con éxito!");
      fetchCursos();
    }
    setMatriculando(false);
  };

  if (loading)
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}
      >
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ padding: 2 }}>
      <List component={Paper} sx={{ mb: 4 }}>
        {matriculados.map((curso) => (
          <ListItem
            key={curso.id}
            secondaryAction={
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleOpenModal(curso)}
              >
                Ver detalles
              </Button>
            }
          >
            <ListItemText
              primary={curso.nombre}
              secondary={`Profesor: ${curso.profesor_asignado} | Cupo máximo: ${curso.cupo_maximo}`}
            />
          </ListItem>
        ))}
      </List>

      <Typography variant="h4" gutterBottom>
        Más Cursos Disponibles
      </Typography>
      {disponibles.length === 0 && (
        <Typography>No hay otros cursos disponibles.</Typography>
      )}
      <List component={Paper}>
        {disponibles.map((curso) => {
          const cuposRestantes =
            curso.cupo_maximo - (curso.cupos_ocupados || 0);
          const cursoLleno = cuposRestantes <= 0;

          return (
            <ListItem
              key={curso.id}
              secondaryAction={
                <>
                  <Button
                    variant="contained"
                    size="small"
                    disabled={cursoLleno || matriculando}
                    onClick={() => handleMatricular(curso.id)}
                    sx={{ mr: 1 }}
                  >
                    {cursoLleno ? "Cupo lleno" : "Matricular"}
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleOpenModal(curso)}
                  >
                    Ver detalles
                  </Button>
                </>
              }
            >
              <ListItemText
                primary={curso.nombre}
                secondary={`Profesor: ${curso.profesor_asignado} | Cupos: ${curso.cupos_ocupados}/${curso.cupo_maximo}`}
              />
            </ListItem>
          );
        })}
      </List>

      {/* Modal detalles */}
      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Detalles del Curso</DialogTitle>
        <DialogContent dividers>
          {selectedCurso && (
            <>
              <Typography variant="h6" gutterBottom>
                {selectedCurso.nombre}
              </Typography>
              <Typography paragraph>{selectedCurso.descripcion}</Typography>
              <Typography>
                <strong>Profesor: </strong> {selectedCurso.profesor_asignado}
              </Typography>
              <Typography>
                <strong>Fecha de creación: </strong>{" "}
                {new Date(selectedCurso.fecha_creacion).toLocaleDateString()}
              </Typography>
              <Typography>
                <strong>Máximo de cupos: </strong> {selectedCurso.cupo_maximo}
              </Typography>
              <Typography>
                <strong>Estado: </strong>{" "}
                {selectedCurso.activo ? "Activo" : "Inactivo"}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
