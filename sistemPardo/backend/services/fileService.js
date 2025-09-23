const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

class FileService {
    constructor() {
        this.uploadsDir = '/app/data/uploads';
        this.ensureUploadsDir();
    }

    ensureUploadsDir() {
        if (!fs.existsSync(this.uploadsDir)) {
            fs.mkdirSync(this.uploadsDir, { recursive: true });
        }
    }

    processZipFile(buffer, filename) {
        try {
            const zip = new AdmZip(buffer);
            const zipEntries = zip.getEntries();
            
            let fileContents = `Análisis de la aplicación: ${filename}\n\n`;
            let fileStructure = 'Estructura de archivos:\n';
            let processedFiles = 0;
            let totalContent = 0;
            const maxTotalContent = 300000; // 300KB máximo de contenido total
            
            // Procesar estructura de archivos
            zipEntries.forEach(entry => {
                if (!entry.isDirectory) {
                    fileStructure += `- ${entry.entryName}\n`;
                }
            });
            
            fileContents += fileStructure + '\n';
            
            // Procesar contenido de archivos relevantes (ordenados por importancia)
            const relevantEntries = zipEntries
                .filter(entry => !entry.isDirectory && this.isRelevantFile(entry.entryName))
                .sort((a, b) => this.getFilePriority(a.entryName) - this.getFilePriority(b.entryName));
            
            for (const entry of relevantEntries) {
                if (totalContent >= maxTotalContent) break;
                
                try {
                    const content = entry.getData().toString('utf8');
                    const contentSize = content.length;
                    
                    if (contentSize < 30000 && totalContent + contentSize < maxTotalContent) {
                        fileContents += `\n=== ${entry.entryName} ===\n`;
                        fileContents += content + '\n';
                        totalContent += contentSize;
                        processedFiles++;
                    }
                } catch (error) {
                    // Ignorar archivos binarios o con errores de encoding
                }
            }
            
            fileContents += `\n--- Resumen: ${processedFiles} archivos procesados ---\n`;
            return fileContents;
        } catch (error) {
            throw new Error('Error procesando archivo ZIP: ' + error.message);
        }
    }
    
    getFilePriority(filename) {
        const name = filename.toLowerCase();
        if (name.includes('main') || name.includes('app') || name.includes('index')) return 1;
        if (name.includes('service') || name.includes('controller')) return 2;
        if (name.includes('model') || name.includes('entity')) return 3;
        if (name.includes('config') || name.includes('properties')) return 4;
        if (name.includes('test')) return 10;
        return 5;
    }

    isRelevantFile(filename) {
        const relevantExtensions = [
            '.java', '.js', '.ts', '.py', '.php', '.cs', '.cpp', '.c', '.h',
            '.html', '.css', '.xml', '.json', '.yml', '.yaml', '.properties',
            '.sql', '.md', '.txt', '.config', '.cfg', '.conf'
        ];
        
        const ext = path.extname(filename).toLowerCase();
        return relevantExtensions.includes(ext);
    }

    saveFileContent(sessionId, content) {
        const filePath = path.join(this.uploadsDir, `${sessionId}.txt`);
        fs.writeFileSync(filePath, content, 'utf8');
        return filePath;
    }

    getFileContent(sessionId) {
        const filePath = path.join(this.uploadsDir, `${sessionId}.txt`);
        try {
            return fs.readFileSync(filePath, 'utf8');
        } catch {
            return null;
        }
    }
}

module.exports = new FileService();