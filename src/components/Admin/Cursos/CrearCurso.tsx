import { useState } from "react";
import supabase from "../../../utils/supabase";

import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";

export default function CrearCurso() {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");

  const [profesorAsignado, setProfesorAsignado] = useState("");
  const [cupoMaximo, setCupoMaximo] = useState(30);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");
    setError(false);

    const { error } = await supabase.from("cursos").insert([
      {
        nombre,
        descripcion,
        categoria,
        profesor_asignado: profesorAsignado,
        cupo_maximo: cupoMaximo,
        activo: true,
        fecha_creacion: new Date().toISOString(),
      },
    ]);

    if (error) {
      setMensaje(`Error al crear curso: ${error.message}`);
      setError(true);
    } else {
      setMensaje("Curso creado exitosamente.");
      setNombre("");
      setDescripcion("");
      setProfesorAsignado("");
      setCupoMaximo(30);
    }

    setOpen(true);
  };

  return (
    <div className="flex justify-center items-center py-10 bg-gray-50 min-h-screen">
      <Paper elevation={3} className="w-full max-w-xl p-8 rounded-2xl">
        <Typography variant="h5" gutterBottom className="text-center font-bold">
          Crear Nuevo Curso
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Nombre del curso"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
            />
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Categoría"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              required
            />
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Profesor asignado"
              value={profesorAsignado}
              onChange={(e) => setProfesorAsignado(e.target.value)}
              required
            />
          </Box>
          <Box mb={4}>
            <TextField
              fullWidth
              type="number"
              label="Cupo máximo"
              value={cupoMaximo}
              inputProps={{ min: 1 }}
              onChange={(e) => setCupoMaximo(Number(e.target.value))}
              required
            />
          </Box>
          <Box textAlign="right">
            <Button type="submit" variant="contained" color="primary">
              Crear Curso
            </Button>
          </Box>
        </form>
      </Paper>

      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity={error ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {mensaje}
        </Alert>
      </Snackbar>
    </div>
  );
}
