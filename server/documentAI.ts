import OpenAI from "openai";
import { storage } from "./storage";
import * as fs from "fs";
import * as path from "path";
import * as util from "util";
import { DocumentPattern } from "@shared/schema";

// o modelo mais recente da OpenAI é "gpt-4o" que foi lançado em 13 de maio de 2024. não altere isso a menos que explicitamente solicitado pelo usuário
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Converter funções síncronas para assíncronas
const readFileAsync = util.promisify(fs.readFile);

interface DocumentClassificationResult {
  documentType: string;
  patternId?: number;
  confidence: number;
  extractedData?: Record<string, any>;
  categoryId?: number;
}

/**
 * Extrai texto de arquivos PDF usando a API do OpenAI
 */
export async function extractTextFromPDF(filePath: string): Promise<string> {
  try {
    const fileData = await readFileAsync(filePath);
    const base64File = fileData.toString("base64");

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extraia todo o texto deste documento PDF. Inclua apenas o texto puro, sem formatação ou interpretações. Ignore imagens e figuras, mas inclua os textos das tabelas."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:application/pdf;base64,${base64File}`
              }
            }
          ],
        },
      ],
      max_tokens: 4000,
    });

    return response.choices[0].message.content || "";
  } catch (error) {
    console.error("Erro ao extrair texto do PDF:", error);
    throw new Error("Não foi possível extrair o texto do documento PDF.");
  }
}

/**
 * Analisa uma imagem e extrai texto usando a API do OpenAI
 */
export async function extractTextFromImage(filePath: string): Promise<string> {
  try {
    const fileData = await readFileAsync(filePath);
    const base64File = fileData.toString("base64");
    const imageType = path.extname(filePath).substring(1);
    const mimeType = `image/${imageType === 'jpg' ? 'jpeg' : imageType}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extraia todo o texto visível nesta imagem. Inclua o texto puro, sem formatação ou interpretações."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64File}`
              }
            }
          ],
        },
      ],
      max_tokens: 2000,
    });

    return response.choices[0].message.content || "";
  } catch (error) {
    console.error("Erro ao extrair texto da imagem:", error);
    throw new Error("Não foi possível extrair o texto da imagem.");
  }
}

/**
 * Classifica um documento baseado em padrões predefinidos
 */
export async function classifyDocument(filePath: string): Promise<DocumentClassificationResult> {
  try {
    // Extrair texto baseado no tipo de arquivo
    const fileExt = path.extname(filePath).toLowerCase();
    let documentText = "";

    if (fileExt === '.pdf') {
      documentText = await extractTextFromPDF(filePath);
    } else if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(fileExt)) {
      documentText = await extractTextFromImage(filePath);
    } else if (['.txt', '.html', '.xml', '.json', '.csv'].includes(fileExt)) {
      documentText = (await readFileAsync(filePath)).toString('utf-8');
    } else {
      throw new Error(`Formato de arquivo não suportado: ${fileExt}`);
    }

    // Obter todos os padrões de documentos
    const patterns = await storage.getDocumentPatterns();

    // Verificar se há padrões cadastrados
    if (!patterns || patterns.length === 0) {
      return await classifyDocumentWithAI(documentText);
    }

    // Verificar regex patterns primeiro (mais eficiente)
    for (const pattern of patterns) {
      if (pattern.regexPattern) {
        try {
          const regex = new RegExp(pattern.regexPattern, 'i');
          if (regex.test(documentText)) {
            return {
              documentType: pattern.nome,
              patternId: pattern.id,
              confidence: pattern.confidence,
              categoryId: pattern.categoriaId,
            };
          }
        } catch (error) {
          console.error(`Erro ao processar regex para padrão ${pattern.id}:`, error);
        }
      }
    }

    // Verificar palavras-chave
    for (const pattern of patterns) {
      if (pattern.palavrasChave && pattern.palavrasChave.length > 0) {
        const matchingKeywords = pattern.palavrasChave.filter(keyword => 
          documentText.toLowerCase().includes(keyword.toLowerCase())
        );
        
        // Se 75% das palavras-chave forem encontradas, é uma correspondência
        if (matchingKeywords.length / pattern.palavrasChave.length >= 0.75) {
          return {
            documentType: pattern.nome,
            patternId: pattern.id,
            confidence: pattern.confidence * (matchingKeywords.length / pattern.palavrasChave.length),
            categoryId: pattern.categoriaId,
          };
        }
      }
    }

    // Se não for encontrado nenhum padrão, usar IA para classificar
    return await classifyDocumentWithAI(documentText, patterns);
  } catch (error) {
    console.error("Erro ao classificar documento:", error);
    throw new Error("Não foi possível classificar o documento.");
  }
}

/**
 * Usa IA para classificar um documento quando nenhum padrão é encontrado
 */
async function classifyDocumentWithAI(documentText: string, patterns: DocumentPattern[] = []): Promise<DocumentClassificationResult> {
  try {
    // Preparar contexto com os padrões existentes
    let patternContext = "";
    if (patterns.length > 0) {
      patternContext = "Tipos de documentos conhecidos:\n" + 
        patterns.map(p => `- ${p.nome}: ${p.descricao || 'Sem descrição'}`).join("\n");
    }

    const prompt = `
${patternContext}

Analise o seguinte texto extraído de um documento e classifique-o. 
Se o documento se encaixar em um dos tipos de documentos conhecidos listados acima, use exatamente aquele nome.
Se não corresponder a nenhum tipo conhecido, sugira um novo tipo adequado.

Responda em formato JSON com os seguintes campos:
- documentType: nome do tipo de documento
- confidence: valor entre 0 e 1 representando a confiança da classificação
- extractedData: objeto com dados relevantes extraídos (se possível)
- summary: breve resumo do conteúdo do documento

Texto do documento:
${documentText.substring(0, 4000)}
${documentText.length > 4000 ? '...(texto truncado)' : ''}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Você é um especialista em classificação de documentos contábeis, fiscais e empresariais brasileiros."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const result = JSON.parse(response.choices[0].message.content);
    
    // Verificar se o tipo identificado corresponde a algum padrão conhecido
    let patternId, categoryId;
    const matchedPattern = patterns.find(p => 
      p.nome.toLowerCase() === result.documentType.toLowerCase());
    
    if (matchedPattern) {
      patternId = matchedPattern.id;
      categoryId = matchedPattern.categoriaId;
    }

    return {
      documentType: result.documentType,
      confidence: result.confidence,
      extractedData: result.extractedData,
      patternId,
      categoryId
    };
  } catch (error) {
    console.error("Erro ao classificar documento com IA:", error);
    return {
      documentType: "Documento Não Classificado",
      confidence: 0.3,
    };
  }
}

/**
 * Extrai informações específicas de um documento baseado em seu tipo
 */
export async function extractDocumentData(filePath: string, documentType: string): Promise<Record<string, any>> {
  try {
    // Extrair texto baseado no tipo de arquivo
    const fileExt = path.extname(filePath).toLowerCase();
    let documentText = "";

    if (fileExt === '.pdf') {
      documentText = await extractTextFromPDF(filePath);
    } else if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(fileExt)) {
      documentText = await extractTextFromImage(filePath);
    } else if (['.txt', '.html', '.xml', '.json', '.csv'].includes(fileExt)) {
      documentText = (await readFileAsync(filePath)).toString('utf-8');
    } else {
      throw new Error(`Formato de arquivo não suportado: ${fileExt}`);
    }

    // Definir quais campos extrair baseado no tipo de documento
    let fieldsToExtract: string[] = [];
    switch (documentType.toLowerCase()) {
      case "nota fiscal":
      case "nfe":
      case "nota fiscal eletrônica":
        fieldsToExtract = ["número", "data_emissao", "valor_total", "cnpj_emitente", "razao_social_emitente", "cnpj_destinatario", "razao_social_destinatario"];
        break;
      case "contrato":
        fieldsToExtract = ["partes_envolvidas", "data_assinatura", "valor", "prazo", "objeto"];
        break;
      case "recibo":
        fieldsToExtract = ["valor", "data", "pagador", "beneficiario", "descricao"];
        break;
      case "extrato bancário":
        fieldsToExtract = ["banco", "agencia", "conta", "periodo", "saldo_inicial", "saldo_final"];
        break;
      default:
        fieldsToExtract = ["datas", "valores", "nomes", "identificadores"];
        break;
    }

    const prompt = `
Extraia as seguintes informações deste documento classificado como "${documentType}":
${fieldsToExtract.join(", ")}

Responda em formato JSON com os campos solicitados. Se não conseguir encontrar alguma informação, deixe o campo com valor null.

Texto do documento:
${documentText.substring(0, 4000)}
${documentText.length > 4000 ? '...(texto truncado)' : ''}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Você é um especialista em extração de dados de documentos contábeis e fiscais brasileiros."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("Erro ao extrair dados do documento:", error);
    return { error: "Não foi possível extrair dados do documento." };
  }
}