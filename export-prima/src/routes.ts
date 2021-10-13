import { Router, Request, Response } from "express";
import { Readable } from "stream";
import ReadLine from "readline";
import multer from "multer";
import { client } from "./database/client";

const multerconfig = multer();

const router = Router();

interface Produto {
  code_bar: string;
  descricao: string;
  preco: number;
  estoque: number;
}

router.post(
  "/produtos",
  multerconfig.single("file"),
  async (request: Request, response: Response) => {
    const data = request.file?.buffer.toString("utf8");

    const readableFile = new Readable();
    readableFile.push(data);
    readableFile.push(null);

    const produtoline = ReadLine.createInterface({
      input: readableFile,
    });

    const produtos: Produto[] = [];

    for await (let line of produtoline) {
      const produtoSeparado = line.split(",");

      produtos.push({
        code_bar: produtoSeparado[0],
        descricao: produtoSeparado[1],
        preco: Number(produtoSeparado[2]),
        estoque: Number(produtoSeparado[3]),
      });
    }

    for await (let { code_bar, descricao, preco, estoque } of produtos) {
      await client.produto.create({
        data: {
          code_bar,
          descricao,
          preco,
          estoque,
        },
      });
    }
    response.header("Access-Control-Allow-Origin", "*");
    return response.json(produtos);
  }
);

router.get("/produtos", async function (request: Request, response: Response) {
  const data = await client.produto.findMany();
  response.header("Access-Control-Allow-Origin", "*");
  response.status(200).json(data);
});

export { router };
