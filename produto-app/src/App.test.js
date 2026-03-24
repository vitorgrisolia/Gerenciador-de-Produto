import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('carrega e exibe os produtos retornados pela API', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          id: '1',
          name: 'Camiseta Azul',
          price: 49.9,
          sku: 'CAM',
          missingLetter: 'b',
        },
      ],
    });

    render(<App />);

    expect(screen.getByText(/carregando produtos/i)).toBeInTheDocument();
    expect(await screen.findByText('Camiseta Azul')).toBeInTheDocument();
    expect(screen.getByText(/letra ausente do nome/i)).toHaveTextContent('b');
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/products');
  });

  test('envia um novo produto com o SKU normalizado', async () => {
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: '2',
          name: 'Bermuda Preta',
          price: 79.9,
          sku: 'BER',
          missingLetter: 'a',
        }),
      });

    const user = userEvent.setup();

    render(<App />);

    await screen.findByText(/nenhum produto cadastrado ainda/i);

    await user.type(screen.getByLabelText(/nome/i), 'Bermuda Preta');
    await user.type(screen.getByLabelText(/preço/i), '79.90');
    await user.type(screen.getByLabelText(/sku/i), 'ber');
    await user.click(screen.getByRole('button', { name: /adicionar produto/i }));

    expect(global.fetch).toHaveBeenNthCalledWith(
      2,
      'http://localhost:3000/products',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Bermuda Preta',
          price: 79.9,
          sku: 'BER',
        }),
      }),
    );

    expect(await screen.findByText(/produto cadastrado com sucesso/i)).toBeInTheDocument();
    expect(await screen.findByText('Bermuda Preta')).toBeInTheDocument();
  });
});
