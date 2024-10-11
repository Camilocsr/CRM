import { Contact } from 'whatsapp-web.js';
import fs from 'fs/promises';
import path from 'path';

const tempDir = path.join(__dirname, '../../../temp');

async function ensureTempDirExists() {
  try {
    await fs.access(tempDir);
  } catch {
    await fs.mkdir(tempDir, { recursive: true });
  }
}

export async function getAndSaveProfilePicture(contact: Contact): Promise<string | null> {
  try {
    await ensureTempDirExists();

    const profilePicUrl = await contact.getProfilePicUrl();
    
    if (!profilePicUrl) {
      console.log(`No profile picture available for ${contact.number}`);
      return null;
    }

    const response = await fetch(profilePicUrl);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const buffer = await response.arrayBuffer();
    const fileName = `${contact.number}_profile.jpg`;
    const filePath = path.join(tempDir, fileName);

    await fs.writeFile(filePath, Buffer.from(buffer));
    console.log(`Profile picture saved for ${contact.number} at ${filePath}`);

    return filePath;
  } catch (error) {
    console.error(`Error getting/saving profile picture for ${contact.number}:`, error);
    return null;
  }
}