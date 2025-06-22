# Jupiter Swap Application

A modern React application for swapping tokens on Solana using Jupiter APIs. This project includes an MCP (Machine Context Prompt) configuration for enhanced AI assistance.

## Features

- 🚀 **Real-time Quotes**: Get instant swap quotes from Jupiter's DEX aggregator
- 💱 **Token Swapping**: Execute swaps across multiple Solana DEXs
- 🎨 **Modern UI**: Clean, responsive interface built with Tailwind CSS
- 🔧 **TypeScript**: Full type safety and better development experience
- 📱 **Mobile Responsive**: Works seamlessly on all devices
- ⚡ **Fast Performance**: Built with Vite for optimal development and build times

## MCP Integration

This project includes a Jupiter API MCP configuration file (`jupiter-mcp.json`) that can be imported into Claude AI via Cursor. The MCP provides:

- Complete API documentation and examples
- Common token addresses and configurations
- Error handling patterns
- Best practices for Jupiter API integration
- Rate limiting information

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd jupiter-swap-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
jupiter-swap-app/
├── src/
│   ├── components/          # React components
│   │   ├── SwapForm.tsx     # Main swap form
│   │   ├── TokenSelector.tsx # Token selection dropdown
│   │   └── QuoteDetails.tsx # Quote display and execution
│   ├── services/            # API services
│   │   └── jupiterApi.ts    # Jupiter API integration
│   ├── types/               # TypeScript type definitions
│   │   └── jupiter.ts       # Jupiter API types
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
├── jupiter-mcp.json         # MCP configuration file
├── package.json             # Project dependencies
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── README.md                # Project documentation
```

## Jupiter API Integration

The application integrates with Jupiter's v6 API endpoints:

- **GET /quote**: Get swap quotes
- **POST /swap**: Execute swap transactions
- **GET /tokens**: Fetch supported tokens
- **GET /indexed-route-map**: Get routing information

### Supported Tokens

The app includes common Solana tokens:
- SOL (Solana)
- USDC (USD Coin)
- USDT (Tether USD)
- BONK (Bonk)
- JUP (Jupiter)

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Environment Variables

Create a `.env` file in the root directory for any environment-specific configurations:

```env
VITE_JUPITER_API_URL=https://quote-api.jup.ag/v6
```

## Production Deployment

1. Build the application:
```bash
npm run build
```

2. The built files will be in the `dist/` directory

3. Deploy the contents of `dist/` to your hosting provider

## Security Considerations

⚠️ **Important**: This is a demo application. For production use:

- Implement proper wallet integration (e.g., Phantom, Solflare)
- Add transaction signing and verification
- Implement proper error handling and user feedback
- Add rate limiting and API key management
- Ensure secure handling of private keys
- Add comprehensive testing

## API Rate Limits

Jupiter API has the following rate limits:
- Quotes: 100 requests per minute
- Swaps: 10 requests per minute
- Tokens: 1000 requests per minute

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For questions or issues:
- Check the [Jupiter API documentation](https://station.jup.ag/docs/apis/swap-api)
- Review the MCP configuration file for API details
- Open an issue in this repository

## Acknowledgments

- [Jupiter](https://jup.ag/) for providing the DEX aggregation API
- [Solana](https://solana.com/) for the blockchain infrastructure
- [Vite](https://vitejs.dev/) for the build tool
- [Tailwind CSS](https://tailwindcss.com/) for styling 