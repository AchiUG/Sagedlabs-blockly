// Accredible API Service for Certificate Management

const ACCREDIBLE_API_URL = 'https://api.accredible.com/v1';

// Get API key from environment variable
function getAccredibleApiKey(): string | null {
  return process.env.ACCREDIBLE_API_KEY || null;
}

export interface AccredibleRecipient {
  name: string;
  email: string;
}

export interface AccredibleCredentialData {
  recipient: AccredibleRecipient;
  credential: {
    group_name?: string;
    name?: string;
    description?: string;
    issued_on?: string;
    custom_attributes?: Record<string, any>;
  };
}

export interface AccredibleCredentialResponse {
  credential: {
    id: string;
    url: string;
    name: string;
    description: string;
    issued_on: string;
    recipient: {
      name: string;
      email: string;
    };
    sso_url?: string;
  };
}

export class AccredibleService {
  private apiKey: string | null;

  constructor() {
    this.apiKey = getAccredibleApiKey();
  }

  /**
   * Create a certificate credential in Accredible
   */
  async createCredential(
    recipientName: string,
    recipientEmail: string,
    levelTitle: string,
    levelNumber: number,
    completionDate: Date
  ): Promise<AccredibleCredentialResponse | null> {
    if (!this.apiKey) {
      console.error('Accredible API key not configured');
      return null;
    }

    try {
      const credentialData: AccredibleCredentialData = {
        recipient: {
          name: recipientName,
          email: recipientEmail,
        },
        credential: {
          group_name: 'SAGED Learning Platform',
          name: `${levelTitle} Level Certificate`,
          description: `Awarded for successfully completing the ${levelTitle} (Level ${levelNumber}) stage in the SAGED Learning Platform`,
          issued_on: completionDate.toISOString().split('T')[0],
          custom_attributes: {
            'Level': levelNumber,
            'Stage Title': levelTitle,
            'Platform': 'SAGED LMS',
            'Completion Date': completionDate.toISOString().split('T')[0],
          },
        },
      };

      const response = await fetch(`${ACCREDIBLE_API_URL}/credentials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${this.apiKey}`,
        },
        body: JSON.stringify(credentialData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Accredible API error:', response.status, errorText);
        return null;
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error creating Accredible credential:', error);
      return null;
    }
  }

  /**
   * Get credential details by ID
   */
  async getCredential(credentialId: string): Promise<AccredibleCredentialResponse | null> {
    if (!this.apiKey) {
      console.error('Accredible API key not configured');
      return null;
    }

    try {
      const response = await fetch(`${ACCREDIBLE_API_URL}/credentials/${credentialId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        console.error('Error fetching credential:', response.status);
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching Accredible credential:', error);
      return null;
    }
  }

  /**
   * Update a credential
   */
  async updateCredential(
    credentialId: string,
    updates: Partial<AccredibleCredentialData['credential']>
  ): Promise<boolean> {
    if (!this.apiKey) {
      console.error('Accredible API key not configured');
      return false;
    }

    try {
      const response = await fetch(`${ACCREDIBLE_API_URL}/credentials/${credentialId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${this.apiKey}`,
        },
        body: JSON.stringify({ credential: updates }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error updating Accredible credential:', error);
      return false;
    }
  }

  /**
   * Delete a credential
   */
  async deleteCredential(credentialId: string): Promise<boolean> {
    if (!this.apiKey) {
      console.error('Accredible API key not configured');
      return false;
    }

    try {
      const response = await fetch(`${ACCREDIBLE_API_URL}/credentials/${credentialId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${this.apiKey}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Error deleting Accredible credential:', error);
      return false;
    }
  }

  /**
   * List all credentials for a recipient
   */
  async getRecipientCredentials(email: string): Promise<AccredibleCredentialResponse[] | null> {
    if (!this.apiKey) {
      console.error('Accredible API key not configured');
      return null;
    }

    try {
      const response = await fetch(
        `${ACCREDIBLE_API_URL}/credentials?email=${encodeURIComponent(email)}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Token ${this.apiKey}`,
          },
        }
      );

      if (!response.ok) {
        console.error('Error fetching recipient credentials:', response.status);
        return null;
      }

      const result = await response.json();
      return result.credentials || [];
    } catch (error) {
      console.error('Error fetching recipient credentials:', error);
      return null;
    }
  }
}

export const accredibleService = new AccredibleService();
