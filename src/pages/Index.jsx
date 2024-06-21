import React, { useState } from "react";
import { Container, VStack, Input, Button, Select, Text, Box, useToast } from "@chakra-ui/react";

const Index = () => {
  const [url, setUrl] = useState("");
  const [format, setFormat] = useState("360p");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleDownload = async () => {
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a YouTube URL",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`https://youtube-video-downloader-api.herokuapp.com/api/info?url=${url}`);
      const data = await response.json();

      if (data.error) {
        toast({
          title: "Error",
          description: data.error,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        const downloadUrl = data.formats.find(f => f.qualityLabel === format || f.mimeType.includes(format)).url;
        window.location.href = downloadUrl;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch video information",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4} width="100%">
        <Text fontSize="2xl">YouTube Downloader</Text>
        <Input
          placeholder="Paste YouTube link here"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          size="lg"
        />
        <Select value={format} onChange={(e) => setFormat(e.target.value)} size="lg">
          <option value="360p">360p</option>
          <option value="480p">480p</option>
          <option value="720p">720p</option>
          <option value="1080p">1080p</option>
          <option value="4k">4k</option>
          <option value="mp3">mp3</option>
        </Select>
        <Button onClick={handleDownload} isLoading={loading} colorScheme="blue" size="lg" width="100%">
          Download
        </Button>
      </VStack>
    </Container>
  );
};

export default Index;