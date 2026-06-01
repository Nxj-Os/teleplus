export const guardarEntrada = async (entrada) => {
    console.log("Enviando entrada:", entrada);

    const response = await fetch("http://localhost:8080/api/entradas", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(entrada),
    });

    return await response.json();
};

export const obtenerEntradas = async () => {
  const response = await fetch(
    "http://localhost:8080/api/entradas"
  );

  return await response.json();
};
