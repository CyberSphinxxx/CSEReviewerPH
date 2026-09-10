export function formatPublisherId(clientId?: string | null): string {
  if (!clientId) {
    return "pub-0000000000000000";
  }
  const trimmed = clientId.trim();
  if (trimmed.startsWith("ca-pub-")) {
    return trimmed.replace(/^ca-/, "");
  }
  if (!trimmed.startsWith("pub-")) {
    return `pub-${trimmed}`;
  }
  return trimmed;
}

export function generateAdsTxtContent(clientId?: string | null): string {
  const pubId = formatPublisherId(clientId);
  const isDefault = pubId === "pub-0000000000000000";

  const lines = [
    "# csereviewph.com — Google AdSense Authorized Digital Sellers (ads.txt)",
    "# See: https://support.google.com/adsense/answer/7532444",
  ];

  if (isDefault) {
    lines.push(
      "# Note: Provide your Google AdSense Client ID via NEXT_PUBLIC_ADSENSE_CLIENT_ID in .env.local",
      "# Format: ca-pub-XXXXXXXXXXXXXXXX"
    );
  }

  lines.push(`google.com, ${pubId}, DIRECT, f08c47fec0942fa0`);

  return lines.join("\n") + "\n";
}
