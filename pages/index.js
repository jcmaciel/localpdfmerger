import { NextSeo } from "next-seo";
import Head from "next/head";
import LandingLayout from "../components/LandingLayout";
import { Box, Flex, Button, Icon, Text } from "@chakra-ui/react";
import { FaFilePdf, FaCompress, FaImages, FaWater } from "react-icons/fa";

export default function Home() {
  return (
    <>
      <NextSeo
        title="Local PDF - Your Free PDF Editor in the Browser"
        description="Edit PDF files in your browser with Local PDF. Merge, optimize, watermark, and more. No installation or registration needed, and your files never leave your system."
        canonical="https://localpdf.tech/"
        openGraph={{
          url: "https://localpdf.tech/",
          title: "Local PDF - Your Free PDF Editor in the Browser",
          description:
            "Edit PDF files in your browser with Local PDF. Merge, optimize, watermark, and more. No installation or registration needed, and your files never leave your system.",
          type: "website",
          images: [
            {
              url: "https://raw.githubusercontent.com/julianfbeck/localpdfmerger/main/public/og-image-01.png",
              width: 1200,
              height: 630,
              alt: "Local PDF - Your Free PDF Editor in the Browser",
              type: "image/jpeg",
            },
          ],
          siteName: "Local PDF",
        }}
        twitter={{
          handle: "@julianfbeck",
          site: "@julianfbeck",
          cardType: "summary_large_image",
        }}
      />

      <LandingLayout>
        <Box textAlign="center" mb={8}>
          <Text fontSize="2xl" fontWeight="bold">
            Ferramentas úteis para PDF completamente grátis, super rápida, sem necessidade de upload. Privacidade garantida com seus arquivos.
          </Text>
        </Box>
        <Flex justify="center" align="center" wrap="wrap" gap={4}>
          <Button
            as="a"
            href="/merge"
            size="lg"
            leftIcon={<Icon as={FaFilePdf} w={8} h={8} />}
            colorScheme="blue"
          >
            Mesclar PDFs
          </Button>
          <Button
            as="a"
            href="/optimize"
            size="lg"
            leftIcon={<Icon as={FaCompress} w={8} h={8} />}
            colorScheme="green"
          >
            Otimizar PDFs
          </Button>
          <Button
            as="a"
            href="/extract"
            size="lg"
            leftIcon={<Icon as={FaImages} w={8} h={8} />}
            colorScheme="purple"
          >
            Extrair Imagens
          </Button>
          <Button
            as="a"
            href="/watermark"
            size="lg"
            leftIcon={<Icon as={FaWater} w={8} h={8} />}
            colorScheme="teal"
          >
            Adicionar Marca d'Água
          </Button>
        </Flex>
      </LandingLayout>
    </>
  );
}