export default function MerkleTreeDiagram() {
  return (
    <div className="not-prose my-6 overflow-x-auto rounded-lg border border-border bg-surface p-6">
      <p className="mb-5 text-xs font-semibold uppercase tracking-wide text-muted">
        Merkle tree of four transactions
      </p>
      <div className="flex min-w-[480px] flex-col items-center gap-3">
        <div className="rounded-md border border-accent bg-accent-soft px-4 py-2 font-mono text-sm text-accent">
          Root = Hash(H12 + H34)
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex w-full justify-center gap-10">
          <div className="flex flex-col items-center gap-3">
            <div className="rounded-md border border-border bg-background px-3 py-1.5 font-mono text-xs text-foreground">
              H12 = Hash(H1 + H2)
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex gap-4">
              <div className="rounded-md border border-border bg-background px-3 py-1.5 font-mono text-xs text-muted">
                H1 = Hash(Tx1)
              </div>
              <div className="rounded-md border border-border bg-background px-3 py-1.5 font-mono text-xs text-muted">
                H2 = Hash(Tx2)
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="rounded-md border border-border bg-background px-3 py-1.5 font-mono text-xs text-foreground">
              H34 = Hash(H3 + H4)
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex gap-4">
              <div className="rounded-md border border-border bg-background px-3 py-1.5 font-mono text-xs text-muted">
                H3 = Hash(Tx3)
              </div>
              <div className="rounded-md border border-border bg-background px-3 py-1.5 font-mono text-xs text-muted">
                H4 = Hash(Tx4)
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-4 text-xs text-muted">
        Proving Tx2 is included needs only H1, H34, and the root — not the other transactions.
      </p>
    </div>
  );
}
