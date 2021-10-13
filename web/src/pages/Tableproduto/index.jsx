import React, { useState, useEffect } from 'react';
import {
  Heading,
  VStack,
  Center,
  HStack,
  Input,
  IconButton,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from '@chakra-ui/react';

import api from './../../services/api';

import { GrDocumentCsv } from 'react-icons/gr';

function Tableproduto() {
  const [produto, setProduto] = useState([]);
  const [file, setFile] = useState();

  async function getProduto() {
    const { data } = await api.get('/produtos');
    setProduto(data);
    console.log(produto);
  }

  useEffect(() => {
    getProduto();
  }, [produto]);

  const saveFile = e => {
    setFile(e.target.files[0]);
  };

  async function importFile() {
    const fromData = new FormData();
    fromData.append('file', file);
    setFile(null);
    try {
      await api.post('/produtos', fromData);
    } catch (error) {
      alert('Erro ao importa o Arquivo');
    }
  }

  return (
    <VStack spacing={6} alignItems={'flex-start'}>
      <Center>
        <Heading color={'blue.400'}>Produtos</Heading>
      </Center>

      <HStack spacing={4}>
        <Input
          type="file"
          fontWeight={'bold'}
          w={380}
          alignItems={'center'}
          onChange={saveFile}
        />

        <IconButton
          colorScheme="green"
          aria-label="Search database"
          icon={<GrDocumentCsv />}
          onClick={importFile}
        />
      </HStack>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>id</Th>
            <Th>cod_barra</Th>
            <Th>descrição</Th>
            <Th>preço</Th>
            <Th>estoque</Th>
          </Tr>
        </Thead>
        <Tbody>
          {produto.map(item => {
            return (
              <Tr key={item.id}>
                <Td>{item.id}</Td>
                <Td>{item.code_bar}</Td>
                <Td>{item.descricao}</Td>
                <Td>{item.preco}</Td>
                <Td>{item.estoque}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </VStack>
  );
}

export default Tableproduto;
