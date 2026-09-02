export type WeddingRuntimeEnv = {
  DB?: D1Database;
  WEDDING_ADMIN_KEY?: string;
};

export async function getRuntimeEnv(): Promise<WeddingRuntimeEnv> {
  const runtime = await import("wedding-runtime-env");
  return runtime.env as unknown as WeddingRuntimeEnv;
}
