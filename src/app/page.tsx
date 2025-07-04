'use client';

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function SorteioApp() {
  const [inicio1, setInicio1] = useState<number | "">(1);
  const [fim1, setFim1] = useState<number | "">(10);
  const [inicio2, setInicio2] = useState<number | "">(20);
  const [fim2, setFim2] = useState<number | "">(30);
  const [numerosRestantes, setNumerosRestantes] = useState<number[]>([]);
  const [numerosSorteados, setNumerosSorteados] = useState<number[]>([]);
  const [sorteado, setSorteado] = useState<number | null>(null);
  const [iniciado, setIniciado] = useState(false);
  const [configurarIntervalos, setConfigurarIntervalos] = useState(true);

  useEffect(() => {
    const guardados = localStorage.getItem("janeira_sorteio_historico");
    if (guardados) {
      setNumerosSorteados(JSON.parse(guardados));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("janeira_sorteio_historico", JSON.stringify(numerosSorteados));
  }, [numerosSorteados]);

  const rangesSobrepostos = () => {
    if (
      inicio1 === "" ||
      fim1 === "" ||
      inicio2 === "" ||
      fim2 === ""
    )
      return false;
    return (
      (inicio2 >= inicio1 && inicio2 <= fim1) ||
      (fim2 >= inicio1 && fim2 <= fim1) ||
      (inicio1 >= inicio2 && inicio1 <= fim2) ||
      (fim1 >= inicio2 && fim1 <= fim2)
    );
  };

  const iniciarSorteio = () => {
    if (rangesSobrepostos()) return;
    const lista = [];
    for (let i = Number(inicio1); i <= Number(fim1); i++) lista.push(i);
    for (let i = Number(inicio2); i <= Number(fim2); i++) lista.push(i);
    setNumerosRestantes(lista);
    setSorteado(null);
    setNumerosSorteados([]);
    setIniciado(true);
    setConfigurarIntervalos(false);
  };

  const novoSorteio = () => {
    setInicio1(1);
    setFim1(10);
    setInicio2(20);
    setFim2(30);
    setNumerosRestantes([]);
    setNumerosSorteados([]);
    setSorteado(null);
    setIniciado(false);
    setConfigurarIntervalos(true);
  };

  const sortearNumero = () => {
    if (numerosRestantes.length === 0) return;
    const index = Math.floor(Math.random() * numerosRestantes.length);
    const escolhido = numerosRestantes[index];
    const restantes = [...numerosRestantes];
    restantes.splice(index, 1);
    setNumerosRestantes(restantes);
    setNumerosSorteados([...numerosSorteados, escolhido]);
    setSorteado(escolhido);
  };

  const gerarNovoVencedor = () => {
    setSorteado(null);
    sortearNumero();
  };

  const exportarNumeros = () => {
    const conteudo = numerosSorteados.join(", ");
    const blob = new Blob([conteudo], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "numeros_sorteados.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-white p-4 flex flex-col items-center">
      <Image src="/download.png" alt="Janeira Logo" width={180} height={80} />
      <h1 className="text-xl mt-2 font-semibold text-green-800">
        Parte da Nossa Terra, Parte da Sua Vida.
      </h1>

      <Card className="mt-6 w-full max-w-md p-4">
        <CardContent className="flex flex-col gap-4">
          {configurarIntervalos && (
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-medium text-gray-700 text-center">
                Indica a Range de Números a Sortear
              </h2>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Início intervalo 1"
                  value={inicio1}
                  onChange={(e) => setInicio1(e.target.value === "" ? "" : parseInt(e.target.value))}
                />
                <Input
                  type="number"
                  placeholder="Fim intervalo 1"
                  value={fim1}
                  onChange={(e) => setFim1(e.target.value === "" ? "" : parseInt(e.target.value))}
                />
              </div>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Início intervalo 2"
                  value={inicio2}
                  onChange={(e) => setInicio2(e.target.value === "" ? "" : parseInt(e.target.value))}
                />
                <Input
                  type="number"
                  placeholder="Fim intervalo 2"
                  value={fim2}
                  onChange={(e) => setFim2(e.target.value === "" ? "" : parseInt(e.target.value))}
                />
              </div>
              <Button
                onClick={iniciarSorteio}
                disabled={
                  inicio1 === "" ||
                  fim1 === "" ||
                  inicio2 === "" ||
                  fim2 === "" ||
                  inicio1 > fim1 ||
                  inicio2 > fim2 ||
                  rangesSobrepostos()
                }
              >
                Iniciar Sorteio
              </Button>
            </div>
          )}

          {iniciado && (
            <>
              <Button
                onClick={sortearNumero}
                disabled={numerosRestantes.length === 0}
              >
                Sortear Número
              </Button>
              {sorteado !== null && (
                <div className="text-2xl font-bold text-center text-green-600">
                  Número sorteado: {sorteado}
                </div>
              )}
              {numerosRestantes.length > 0 && sorteado !== null && (
                <Button onClick={gerarNovoVencedor} variant="default">
                  Gerar Novo Vencedor
                </Button>
              )}
              {numerosRestantes.length === 0 && (
                <div className="text-center text-sm text-gray-500">
                  Todos os números já foram sorteados.
                </div>
              )}
              <Button onClick={exportarNumeros} variant="outline">
                Exportar Números Sorteados
              </Button>
              <div className="text-sm text-gray-700">
                Histórico: {numerosSorteados.join(", ") || "nenhum número ainda."}
              </div>
              <Button onClick={novoSorteio} variant="secondary">
                Novo Sorteio
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
