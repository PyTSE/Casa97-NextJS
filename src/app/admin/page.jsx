"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "../../../public/casa97.png";
import Link from "next/link";
import { useRouter } from 'next/navigation'; // Certifique-se de usar o import correto
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import "@/lib/firebase"; 

export const description =
  "Uma página de login com duas colunas. A primeira coluna tem o formulário de login com e-mail e senha. Há um link para recuperar senha e um link para se cadastrar se você não tiver uma conta. A segunda coluna tem uma imagem de capa.";

export const iframeHeight = "800px";

export const containerClassName = "w-full h-full p-4 lg:p-0";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter(); // Hook do Next.js para roteamento

  const handleLogin = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleForgotPassword = async () => {
    const auth = getAuth();
    try {
      await sendPasswordResetEmail(auth, email);
      alert("E-mail de recuperação de senha enviado!");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-2xl text-left font-bold">Entrar no Sistema Casa97</h1>
            <p className="text-left text-muted-foreground">
              Digite seu e-mail abaixo para entrar na sua conta
            </p>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seuemail@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Senha</Label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="ml-auto inline-block text-sm underline"
                >
                  Esqueceu sua senha?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Entrar
            </Button>
          </form>
        </div>
      </div>
      <div className="hidden bg-muted lg:flex items-center justify-center">
        <Image
          src={Logo}
          alt="Imagem"
          className="h-[400px] w-[400px] object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
