import { WebsiteTemplate } from '../types';
import { LLMService } from './llm-service';
import { getLLMConfig } from '../config/llm-config';
import Handlebars from 'handlebars';

export class WebsiteGenerator {
  private llmService: LLMService;

  constructor(llmProvider: string = 'openai') {
    const config = getLLMConfig(llmProvider);
    this.llmService = new LLMService(config);
  }

  async generateWebsite(template: WebsiteTemplate, leadData: any): Promise<string> {
    try {
      // Generate content using LLM
      const content = await this.llmService.generateWebsiteContent({
        lead: leadData,
        template: {
          name: template.name,
          description: template.description,
          category: template.category,
        },
      });

      // Parse the generated content
      const parsedContent = JSON.parse(content);

      // Prepare template data
      const templateData = {
        ...parsedContent,
        currentYear: new Date().getFullYear(),
      };

      // Compile and render the template
      const compiledTemplate = Handlebars.compile(template.html);
      const renderedHtml = compiledTemplate(templateData);

      // Create the final HTML with embedded CSS
      const finalHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${templateData.companyName} - ${templateData.tagline}</title>
  <style>
    ${template.css || ''}
  </style>
</head>
<body>
  ${renderedHtml}
</body>
</html>
      `;

      return finalHtml;
    } catch (error) {
      console.error('Error generating website:', error);
      throw new Error('Failed to generate website');
    }
  }

  async generatePreview(template: WebsiteTemplate, leadData: any): Promise<string> {
    try {
      // Generate a simplified version for preview
      const content = await this.llmService.generateWebsiteContent({
        lead: leadData,
        template: {
          name: template.name,
          description: template.description,
          category: template.category,
        },
      }, true); // Set preview mode to true for shorter content

      // Parse the generated content
      const parsedContent = JSON.parse(content);

      // Prepare template data
      const templateData = {
        ...parsedContent,
        currentYear: new Date().getFullYear(),
      };

      // Compile and render the template
      const compiledTemplate = Handlebars.compile(template.html);
      const renderedHtml = compiledTemplate(templateData);

      // Create the final HTML with embedded CSS
      const finalHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${templateData.companyName} - Preview</title>
  <style>
    ${template.css || ''}
  </style>
</head>
<body>
  ${renderedHtml}
</body>
</html>
      `;

      return finalHtml;
    } catch (error) {
      console.error('Error generating preview:', error);
      throw new Error('Failed to generate preview');
    }
  }
} 