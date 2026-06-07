/**
 * Storage boundary for Certification OS.
 *
 * Minimal adapter so document uploads and outputs are not hard-coded to local paths.
 * Local filesystem is the default implementation; Hetzner Object Storage can be
 * added later without changing Tool 2 domain code.
 */

export interface StorageObjectRef {
  key: string;
  url?: string;
  mimeType?: string;
  sizeBytes?: number;
}

export interface StorageListOptions {
  prefix?: string;
  limit?: number;
}

export interface StorageAdapter {
  /** Store bytes and return a stable reference key. */
  put(
    key: string,
    data: Buffer | ArrayBuffer,
    mimeType: string,
  ): Promise<StorageObjectRef>;

  /** Fetch object bytes by key. */
  get(key: string): Promise<Buffer>;

  /** List objects under an optional prefix. */
  list(options?: StorageListOptions): Promise<StorageObjectRef[]>;

  /** Remove object by key. */
  delete(key: string): Promise<void>;
}

/**
 * Local filesystem adapter — development and single-node deployment.
 * Paths are relative to STORAGE_LOCAL_ROOT (default: ./storage).
 */
export class LocalStorageAdapter implements StorageAdapter {
  constructor(private readonly root: string = process.env.STORAGE_LOCAL_ROOT ?? "./storage") {}

  async put(
    key: string,
    data: Buffer | ArrayBuffer,
    mimeType: string,
  ): Promise<StorageObjectRef> {
    void mimeType;
    void this.root;
    void key;
    void data;
    throw new Error(
      "LocalStorageAdapter not wired yet — scaffold only. Use legacy UploadThing until migration.",
    );
  }

  async get(_key: string): Promise<Buffer> {
    throw new Error("LocalStorageAdapter not wired yet — scaffold only.");
  }

  async list(_options?: StorageListOptions): Promise<StorageObjectRef[]> {
    throw new Error("LocalStorageAdapter not wired yet — scaffold only.");
  }

  async delete(_key: string): Promise<void> {
    throw new Error("LocalStorageAdapter not wired yet — scaffold only.");
  }
}

/**
 * Future: HetznerObjectStorageAdapter implements StorageAdapter with S3-compatible API.
 * Tool 2 should depend only on StorageAdapter, not on UploadThing or local paths.
 */

export function createStorageAdapter(): StorageAdapter {
  const backend = process.env.STORAGE_BACKEND ?? "local";
  if (backend === "local") {
    return new LocalStorageAdapter();
  }
  throw new Error(`Storage backend "${backend}" is not configured yet.`);
}
