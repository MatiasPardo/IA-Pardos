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
            
            // Procesar estructura de archivos
            zipEntries.forEach(entry => {
                if (!entry.isDirectory) {
                    fileStructure += `- ${entry.entryName}\n`;
                }
            });
            
            fileContents += fileStructure + '\n';
            
            // Procesar contenido de archivos relevantes
            zipEntries.forEach(entry => {
                if (!entry.isDirectory && this.isRelevantFile(entry.entryName)) {
                    try {
                        const content = entry.getData().toString('utf8');
                        if (content.length < 10000) { // Limitar tamaño
                            fileContents += `\n=== ${entry.entryName} ===\n`;
                            fileContents += content + '\n';
                        }
                    } catch (error) {
                        // Ignorar archivos binarios o con errores de encoding
                    }
                }
            });
            
            return fileContents;
        } catch (error) {
            throw new Error('Error procesando archivo ZIP: ' + error.message);
        }
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