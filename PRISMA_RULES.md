# Regras de Banco de Dados e Prisma

**ATENÇÃO: REGRA ESTRITA DE BANCO DE DADOS**

1. **NUNCA** utilize `npx prisma db push` em ambientes de desenvolvimento que já possuam dados, pois isso pode resultar em exclusão acidental ou perda de tabelas (data-loss).
2. **SEMPRE** utilize `npx prisma migrate dev --name <nome-da-mudanca>` para qualquer alteração de esquema (`schema.prisma`). Dessa forma, criamos um histórico de migrações (`prisma/migrations`) que preserva os dados existentes.
3. Os scripts do `package.json` foram atualizados. Para rodar migrações, utilize `npm run db:migrate`. O uso de `db push` foi intencionalmente bloqueado/sinalizado para evitar acidentes.

Qualquer alteração que envolva banco de dados no código deve obrigatoriamente seguir este fluxo de migration.
