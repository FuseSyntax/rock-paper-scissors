-- CreateTable
CREATE TABLE "User" (
    "publicKey" TEXT NOT NULL,
    "wins" INTEGER NOT NULL,
    "losses" INTEGER NOT NULL,
    "ties" INTEGER NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("publicKey")
);

-- CreateTable
CREATE TABLE "GameHistory" (
    "id" SERIAL NOT NULL,
    "userPublicKey" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "yourChoice" TEXT NOT NULL,
    "computerChoice" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GameHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GameHistory" ADD CONSTRAINT "GameHistory_userPublicKey_fkey" FOREIGN KEY ("userPublicKey") REFERENCES "User"("publicKey") ON DELETE RESTRICT ON UPDATE CASCADE;
