'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import LocalizedLink from './LocalizedLink';
import { useCart } from '@/app/contexts/CartContext';
import { useCurrency } from '@/app/contexts/CurrencyContext';
import { useTranslations } from 'next-intl';

export function MiniCart() {
  const { items, itemCount, subtotal, removeItem, updateQuantity, isOpen, setIsOpen } = useCart();
  const { convertPrice, formatPrice } = useCurrency();
  const t = useTranslations();

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setIsOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          {t('cart.title')}
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={() => setIsOpen(false)}
                          >
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">{t('common.close')}</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-8">
                        {itemCount === 0 ? (
                          <div className="text-center py-12">
                            <p className="text-gray-500">{t('cart.empty')}</p>
                            <LocalizedLink
                              href="/shop"
                              className="mt-4 inline-block text-xandcastle-purple hover:text-purple-700"
                              onClick={() => setIsOpen(false)}
                            >
                              {t('common.continueShopping')}
                            </LocalizedLink>
                          </div>
                        ) : (
                          <div className="flow-root">
                            <ul role="list" className="-my-6 divide-y divide-gray-200">
                              {items.map((item) => (
                                <li key={item.id} className="flex py-6">
                                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                    {item.image && (
                                      <Image
                                        src={item.image}
                                        alt={item.title}
                                        width={96}
                                        height={96}
                                        className="h-full w-full object-cover object-center"
                                      />
                                    )}
                                  </div>

                                  <div className="ml-4 flex flex-1 flex-col">
                                    <div>
                                      <div className="flex justify-between text-base font-medium text-gray-900">
                                        <h3>{item.title}</h3>
                                        <p className="ml-4">{formatPrice(convertPrice(item.price * item.quantity))}</p>
                                      </div>
                                      <p className="mt-1 text-sm text-gray-500">
                                        {item.variantTitle}
                                      </p>
                                    </div>
                                    <div className="flex flex-1 items-end justify-between text-sm">
                                      <div className="flex items-center">
                                        <button
                                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                          className="text-gray-500 hover:text-gray-700"
                                        >
                                          -
                                        </button>
                                        <span className="mx-2 text-gray-500">{t('products.options.quantity')} {item.quantity}</span>
                                        <button
                                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                          className="text-gray-500 hover:text-gray-700"
                                        >
                                          +
                                        </button>
                                      </div>

                                      <div className="flex">
                                        <button
                                          type="button"
                                          className="font-medium text-xandcastle-purple hover:text-purple-700"
                                          onClick={() => removeItem(item.id)}
                                        >
                                          {t('cart.remove')}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    {itemCount > 0 && (
                      <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <p>{t('cart.subtotal')}</p>
                          <p>{formatPrice(convertPrice(subtotal))}</p>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">
                          {t('cart.shippingCalculated')}
                        </p>
                        <div className="mt-6">
                          <LocalizedLink
                            href="/checkout"
                            className="flex items-center justify-center rounded-md border border-transparent bg-xandcastle-purple px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-purple-700"
                            onClick={() => setIsOpen(false)}
                          >
                            {t('common.checkout')}
                          </LocalizedLink>
                        </div>
                        <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                          <p>
                            {t('common.or', { defaultValue: 'or' })}{' '}
                            <LocalizedLink
                              href="/cart"
                              className="font-medium text-xandcastle-purple hover:text-purple-700"
                              onClick={() => setIsOpen(false)}
                            >
                              {t('common.viewCart')}
                            </LocalizedLink>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}