/**
 * @author          aboubakar@mediabox.bi
 * @description     L'utilitaire pour faciliter la répétion d'import des
 *                  providers pr se focaluser sur la page à tester
 */

import React from 'react'
import { render } from '@testing-library/react'

import { AppProvider } from '@/contexts/AppContext';
import { BrowserRouter } from "react-router-dom";

const AllTheProviders = ({ children }) => {
    return (
        <BrowserRouter>
            <AppProvider>
                {children}
            </AppProvider>
        </BrowserRouter>
    )
}

const customRender = (ui, options) =>
    render(ui, { wrapper: AllTheProviders, ...options })

// re-export everything
export * from '@testing-library/react'

// override render method
export { customRender as render }