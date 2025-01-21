import { readFile, writeFile } from "fs/promises";

export const readFile = async (path) => {
  try {
    const data = await readFile(path, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error al leer el archivo ${path}: ${error}`);
    return null;
  }
};

export const writeFile = async (path, data) => {
  try {
    await writeFile(path, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error al escribir en el archivo ${path}: ${error}`);
  }
};
