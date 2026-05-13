import { Router } from "express";
import { Generator } from "tibia-assets";

const router = Router();

type CoinType = "gold" | "platinum" | "crystal";

const coinItemIds: Record<CoinType, number> = {
  gold: Number(process.env.TIBIA_GOLD_COIN_ID ?? 3031),
  platinum: Number(process.env.TIBIA_PLATINUM_COIN_ID ?? 3035),
  crystal: Number(process.env.TIBIA_CRYSTAL_COIN_ID ?? 3043)
};

let generatorPromise: Promise<Generator> | null = null;

const getGenerator = async () => {
  if (generatorPromise) {
    return generatorPromise;
  }

  const appearancesPath = process.env.TIBIA_APPEARANCES_PATH;
  const catalogPath = process.env.TIBIA_CATALOG_PATH;

  if (!appearancesPath || !catalogPath) {
    throw new Error("Arquivos de assets do Tibia não configurados.");
  }

  generatorPromise = (async () => {
    const generator = new Generator(appearancesPath, catalogPath, true);
    await generator.init();
    return generator;
  })();

  return generatorPromise;
};

router.get("/coins/:type", async (req, res) => {
  const coinType = req.params.type as CoinType;
  const itemId = coinItemIds[coinType];

  if (!itemId || Number.isNaN(itemId)) {
    res.status(404).json({ message: "Tipo de moeda inválido.", type: coinType });
    return;
  }

  try {
    const generator = await getGenerator();
    const buffer = await generator.getItem(itemId);

    res.setHeader("Content-Type", "image/png");
    res.send(Buffer.from(buffer));
  } catch (error) {
    res.status(500).json({
      message: "Não foi possível gerar o asset da moeda.",
      detail: error instanceof Error ? error.message : "Erro desconhecido"
    });
  }
});

export default router;
