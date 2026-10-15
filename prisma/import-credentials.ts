// prisma/import-credentials.ts
// Reads peserta.csv (header: email,password,fileUrl) and upserts a
// ParticipantCredential row for each matched User.
//
// Run with:  npm run credentials:import
// (uses the same CommonJS override as the seed script because tsconfig uses
//  "module": "esnext" + "moduleResolution": "bundler")
import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import csv from 'csv-parser'

const prisma = new PrismaClient()

type Row = { email: string; password: string; fileUrl: string }

function loadCsv(path: string): Promise<Row[]> {
  return new Promise((resolve, reject) => {
    const rows: Row[] = []
    fs.createReadStream(path)
      .pipe(csv())
      .on('data', (d) => rows.push(d))
      .on('end', () => resolve(rows))
      .on('error', reject)
  })
}

async function main() {
  const rows = await loadCsv('peserta.csv')

  for (const r of rows) {
    const user = await prisma.user.findUnique({ where: { email: r.email } })
    if (!user) {
      console.warn('✗ User tidak ditemukan:', r.email)
      continue
    }

    await prisma.participantCredential.upsert({
      where: { userId: user.id },
      update: { password: r.password, fileUrl: r.fileUrl },
      create: { userId: user.id, password: r.password, fileUrl: r.fileUrl },
    })

    console.log('✓', r.email)
  }
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect())