import React, { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import {
  Button,
  Stack,
  Box,
  Flex,
  Heading,
  Center,
  Text,
  Spacer,
  Fade,
  useDisclosure,
} from "@chakra-ui/react";
import toast, { Toaster } from "react-hot-toast";
import { BFSRequire, configure } from "browserfs";
import DropzoneField from "../components/dropzone";
import DragDrop from "../components/DragDrop";
import { promisifyAll } from "bluebird";
import DonationModal from "../components/DonationModal";
import {
  downloadAndZipFolder,
  downloadFile,
  readFileAsync,
  runWasm,
} from "../components/Helper";
import { NextSeo } from "next-seo";
import FeatureBlock from "../components/FeatureBlock";
let fs;
let Buffer;

const Optimize = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [files, setFiles] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const init = useCallback(async () => {
    configure(
      {
        fs: "InMemory",
      },
      function (e) {
        if (e) {
          // Ocorreu um erro!
          throw e;
        }
        fs = promisifyAll(BFSRequire("fs"));

        Buffer = BFSRequire("buffer").Buffer;
        global.fs = fs;
        global.Buffer = Buffer;
        const script = document.createElement("script");

        script.src = "wasm_exec.js";
        script.async = true;

        document.body.appendChild(script);
      }
    );
  }, []);

  useEffect(() => {
    init();
  }, [init]);

  const optimizeFiles = async () => {
    setIsOptimizing(true);
    await startOptimizingFiles();
    setIsOptimizing(false);
    onOpen();
  };

  const startOptimizingFiles = async () => {
    for (let i in files) {
      const toastId = toast.loading(`Carregando Arquivo ${files[i].path}`);
      try {
        await readFileAsync(files[i], files, setFiles);
      } catch (error) {
        console.log(error);
        toast.error("Houve um erro ao carregar seus PDFs", {
          id: toastId,
        });
      }
      let newFileName =
        files[i].name.replace(/\.[^/.]+$/, "") + "-otimizado.pdf";
      let exitcode = await runWasm([
        "pdfcpu.wasm",
        "optimize",
        "-c",
        "disable",
        files[i].path,
        newFileName,
      ]);

      if (exitcode !== 0) {
        toast.error("Houve um erro ao otimizar seus PDFs", {
          id: toastId,
        });
        return;
      }
      await fs.unlinkAsync(files[i].path);
      await downloadFile(fs, newFileName);
      await fs.unlinkAsync(newFileName);
      toast.success("Seu arquivo está pronto!", {
        id: toastId,
      });
    }
    setFiles([]);
    return;
  };

  const LoadingButton = () => {
    if (isOptimizing) {
      return (
        <>
          <Button
            colorScheme="blue"
            isLoading
            disabled={isOptimizing || files.length <= 0}
            variant="outline"
          >
            Otimizar Arquivos
          </Button>
        </>
      );
    } else {
      return (
        <Button
          colorScheme="blue"
          variant="outline"
          disabled={isOptimizing || files.length <= 0}
          onClick={optimizeFiles}
        >
          Otimizar Arquivos
        </Button>
      );
    }
  };

  return (
    <>
      <NextSeo
        title="Otimizar Arquivos PDF com Local PDF"
        description="Local PDF permite que você otimize seus arquivos PDF para reduzir o tamanho do arquivo, sem comprometer a qualidade. Experimente nossa ferramenta de otimização de PDF hoje."
        canonical="https://localpdf.tech/optimize"
        openGraph={{
          url: "https://localpdf.tech/optimize",
          title: "Otimizar Arquivos PDF com Local PDF",
          description:
            "Local PDF permite que você otimize seus arquivos PDF para reduzir o tamanho do arquivo, sem comprometer a qualidade. Experimente nossa ferramenta de otimização de PDF hoje.",
          type: "website",
          images: [
            {
              url: "https://raw.githubusercontent.com/julianfbeck/localpdfmerger/main/public/og-image-01.png",
              width: 1200,
              height: 630,
              alt: "Otimizar Arquivos PDF com Local PDF",
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

      <Flex width="full" height="full" align="center" justifyContent="center">
        <Box
          p={8}
          maxWidth={["100%", "95%", "70%", "50%"]}
          borderWidth={1}
          borderRadius={8}
          boxShadow="lg"
          backgroundColor="white"
        >
          <Center>
            <FeatureBlock
              title={"Otimizar Arquivos PDF"}
              text={
                "Local PDF permite que você otimize seus arquivos PDF para reduzir o tamanho do arquivo, sem comprometer a qualidade. Experimente nossa ferramenta de otimização de PDF hoje."
              }
            />
          </Center>
          <Text color={"gray.500"} px={[1, 10, 15]} pb={6}>
            Elimine recursos de página redundantes, como fontes e imagens incorporadas, e baixe arquivos PDF otimizados com melhor compressão.
          </Text>
          <DropzoneField setFiles={setFiles} files={files}></DropzoneField>
          <Toaster />
          <DonationModal
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
          ></DonationModal>
          <aside>
            <Fade in={files.length !== 0} reverse>
              <Stack spacing={8} m={3}>
                <div className={`${files.length > 3 ? "customList" : ""}`}>
                  <DragDrop
                    setState={setFiles}
                    state={files}
                    isMerging={isOptimizing}
                  ></DragDrop>
                </div>
              </Stack>
            </Fade>
          </aside>
          <Text
            fontSize="xs"
            m={2}
            textAlign="center"
            color="primary.800"
            opacity="0.6"
          >
            {files.length === 0 ? "" : "Você pode arrastar e soltar arquivos para ordenar"}
          </Text>
          <Flex row={2}>
            <Spacer />
            <LoadingButton></LoadingButton>
          </Flex>
        </Box>
      </Flex>
    </>
  );
};

export default Optimize;