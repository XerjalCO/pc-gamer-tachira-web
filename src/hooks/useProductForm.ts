"use client";
import { useRef, useState } from "react";
import type { Product } from "@/data/inventario";
import type { ProductFormData } from "@/lib/adminStock";
import { DEFAULT_GARANTIA } from "@/data/admin";
import { rowsToSpecs, specsToRows, type SpecRow } from "@/components/admin/SpecsFieldset";

/**
 * Estado del formulario de producto. Se inicializa con `product` y `initialStock` si se está editando;
 * el padre debe cambiar la `key` del formulario para recargarlo con otro producto.
 */
export function useProductForm(product?: Product | null, initialStock = 0) {
  const [name, setName] = useState(product?.name ?? "");
  const [desc, setDesc] = useState(product?.desc ?? "");
  const [categoria, setCategoria] = useState(product?.categoria ?? "");
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [stock, setStock] = useState(product ? String(initialStock) : "0");
  const [garantia, setGarantia] = useState(product?.garantia ?? DEFAULT_GARANTIA);
  const [specRows, setSpecRows] = useState<SpecRow[]>(() => specsToRows(product?.specs));
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Restablece todos los campos al estado de "nuevo producto"
  function reset() {
    setName("");
    setDesc("");
    setCategoria("");
    setPrice("");
    setStock("0");
    setGarantia(DEFAULT_GARANTIA);
    setSpecRows(specsToRows());
    setFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // Normaliza los valores del formulario y arma el objeto specs para Supabase
  function toData(): ProductFormData {
    return {
      name: name.trim(),
      desc: desc.trim(),
      categoria: categoria.trim(),
      price: Number(price),
      garantia: garantia.trim(),
      specs: rowsToSpecs(specRows),
      stock: Math.max(0, Math.trunc(Number(stock) || 0)),
    };
  }

  return {
    fields: { name, desc, categoria, price, stock, garantia },
    setters: { setName, setDesc, setCategoria, setPrice, setStock, setGarantia },
    specRows,
    setSpecRows,
    files,
    setFiles,
    fileInputRef,
    reset,
    toData,
  };
}
