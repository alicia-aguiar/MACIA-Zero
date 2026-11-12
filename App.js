import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Alert,
  Linking,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const AppContext = createContext(null);
const useApp = () => useContext(AppContext);

const C = {
  navy: '#26356D',
  blue: '#4D73D9',
  pink: '#F39AC2',
  paleBlue: '#EAF0FF',
  palePink: '#FFF0F7',
  background: '#F8F8FC',
  white: '#FFFFFF',
  text: '#252944',
  muted: '#777B91',
  border: '#E9EAF2',
  green: '#2D9867',
};

const PRODUCTS = [
  {
    id: '1',
    name: 'Casquinha Clássica',
    category: 'Sorvetes',
    price: 7.5,
    emoji: '🍦',
    description: 'Casquinha crocante e deliciosa.',
  },
  {
    id: '2',
    name: 'Milk-shake de Morango',
    category: 'Milk-shakes',
    price: 14.9,
    emoji: '🥤',
    description: 'Cremoso, geladinho e cheio de sabor.',
  },
  {
    id: '3',
    name: 'Açaí Tropical',
    category: 'Açaí',
    price: 16,
    emoji: '🍧',
    description: 'Açaí com acompanhamentos.',
  },
  {
    id: '4',
    name: 'Sundae de Chocolate',
    category: 'Sobremesas',
    price: 12.5,
    emoji: '🍨',
    description: 'Sorvete com calda de chocolate.',
  },
  {
    id: '5',
    name: 'Picolé de Limão',
    category: 'Picolés',
    price: 5,
    emoji: '🍋',
    description: 'Refrescante para os dias quentes.',
  },
  {
    id: '6',
    name: 'Brownie com Sorvete',
    category: 'Sobremesas',
    price: 18,
    emoji: '🍫',
    description: 'Brownie macio com sorvete.',
  },
];

const money = value =>
  `R$ ${Number(value || 0).toFixed(2).replace('.', ',')}`;

function montarEnderecoCompleto(dados) {
  if (!dados) return '';

  return [
    dados.logradouro,
    dados.numero ? `nº ${dados.numero}` : '',
    dados.complemento,
    dados.bairro,
    dados.localidade,
    dados.uf,
    dados.cep ? `CEP ${dados.cep}` : '',
    'Brasil',
  ].filter(Boolean).join(', ');
}

async function abrirGoogleMaps(endereco, rota = false) {
  if (!endereco || !endereco.trim()) {
    Alert.alert(
      'Endereço não encontrado',
      'Consulte um CEP válido antes de abrir o mapa.'
    );
    return;
  }

  const destino = encodeURIComponent(endereco);

  const url = rota
    ? `https://www.google.com/maps/dir/?api=1&destination=${destino}&travelmode=driving`
    : `https://www.google.com/maps/search/?api=1&query=${destino}`;

  try {
    await Linking.openURL(url);
  } catch (error) {
    Alert.alert(
      'Não foi possível abrir o Maps',
      'Verifique se há um navegador ou Google Maps instalado.'
    );
  }
}

function Button({ title, onPress, secondary = false }) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[s.button, secondary && s.buttonSecondary]}
    >
      <Text
        style={[
          s.buttonText,
          secondary && s.buttonTextSecondary,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

function Heading({ title, subtitle }) {
  return (
    <View style={s.headingBox}>
      <Text style={s.heading}>{title}</Text>
      {!!subtitle && <Text style={s.subtitle}>{subtitle}</Text>}
    </View>
  );
}

function ProductCard({ product, onPress }) {
  return (
    <TouchableOpacity
      style={s.productCard}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={s.productImage}>
        <Text style={s.productEmoji}>{product.emoji}</Text>
      </View>

      <Text style={s.productName}>{product.name}</Text>

      <Text style={s.productDescription}>
        {product.description}
      </Text>

      <View style={s.productBottom}>
        <Text style={s.price}>{money(product.price)}</Text>

        <View style={s.plus}>
          <Text style={s.plusText}>+</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

/* INÍCIO */

function HomeScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const { width } = useWindowDimensions();

  const columns = width >= 600 ? 3 : 2;

  const filtered = PRODUCTS.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView
        contentContainerStyle={s.page}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.topBar}>
          <View>
            <Text style={s.logoText}>
              MACIA <Text style={s.logoPink}>ZERO</Text>
            </Text>

            <Text style={s.smallMuted}>
              Seu momento mais doce 💗
            </Text>
          </View>

          <TouchableOpacity
            style={s.cartButton}
            onPress={() => navigation.navigate('Carrinho')}
            accessibilityLabel="Abrir carrinho de compras"
          >
            <Text style={s.cartIcon}>🛒</Text>
          </TouchableOpacity>
        </View>

        <View style={s.banner}>
          <Text style={s.bannerEyebrow}>
            SEU MOMENTO MAIS DOCE
          </Text>

          <Text style={s.bannerTitle}>
            Um carinho em forma de sorvete!
          </Text>

          <Text style={s.bannerText}>
            Escolha seus sabores favoritos.
          </Text>

          <Button
            title="Montar meu sorvete"
            onPress={() => navigation.navigate('Personalizar')}
          />

          <Text style={s.bannerEmoji}>🍦 🍓 🍫</Text>
        </View>

        <TextInput
          style={s.search}
          placeholder="Buscar sorvetes e sobremesas..."
          placeholderTextColor={C.muted}
          value={search}
          onChangeText={setSearch}
        />

        <View style={s.sectionTitleRow}>
          <Text style={s.sectionTitle}>Mais pedidos</Text>

          <Text style={s.smallMuted}>
            {filtered.length} produtos
          </Text>
        </View>

        <View style={s.productGrid}>
          {filtered.map(product => (
            <View
              key={product.id}
              style={{
                width: `${100 / columns}%`,
                padding: 5,
              }}
            >
              <ProductCard
                product={product}
                onPress={() =>
                  navigation.navigate('Produto', { product })
                }
              />
            </View>
          ))}
        </View>

        {filtered.length === 0 && (
          <Text style={s.emptyText}>
            Nenhum produto encontrado.
          </Text>
        )}

        <View style={s.infoBanner}>
          <Text style={s.infoEmoji}>💙</Text>

          <View style={{ flex: 1 }}>
            <Text style={s.infoTitle}>
              Seu pedido, do seu jeito!
            </Text>

            <Text style={s.infoText}>
              Escolha, personalize e aproveite.
            </Text>
          </View>
        </View>

        <Button
          title="Conhecer o Clube MACIA"
          secondary
          onPress={() => navigation.navigate('Clube')}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

/* CARDÁPIO */

function MenuScreen({ navigation }) {
  const categories = [
    'Todos',
    'Sorvetes',
    'Açaí',
    'Milk-shakes',
    'Picolés',
    'Sobremesas',
  ];

  const [category, setCategory] = useState('Todos');
  const [search, setSearch] = useState('');

  const filtered = PRODUCTS.filter(product => {
    const matchesCategory =
      category === 'Todos' || product.category === category;

    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.page}>
        <View style={s.topBar}>
          <View style={{ flex: 1 }}>
            <Heading
              title="Nosso cardápio"
              subtitle="Encontre seu próximo favorito."
            />
          </View>

          <TouchableOpacity
            style={s.cartButton}
            onPress={() => navigation.navigate('Carrinho')}
            accessibilityLabel="Abrir carrinho de compras"
          >
            <Text style={s.cartIcon}>🛒</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={s.search}
          placeholder="Buscar no cardápio..."
          placeholderTextColor={C.muted}
          value={search}
          onChangeText={setSearch}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={s.categoryScroll}
        >
          {categories.map(item => (
            <TouchableOpacity
              key={item}
              onPress={() => setCategory(item)}
              style={[
                s.category,
                category === item && s.categorySelected,
              ]}
            >
              <Text
                style={[
                  s.categoryText,
                  category === item && s.categoryTextSelected,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={s.productGrid}>
          {filtered.map(product => (
            <View
              key={product.id}
              style={{ width: '50%', padding: 5 }}
            >
              <ProductCard
                product={product}
                onPress={() =>
                  navigation.navigate('Produto', { product })
                }
              />
            </View>
          ))}
        </View>

        {filtered.length === 0 && (
          <Text style={s.emptyText}>
            Nenhum produto encontrado.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/* PRODUTO */

function ProductScreen({ route, navigation }) {
  const { product } = route.params;
  const [quantity, setQuantity] = useState(1);

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.page}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={s.link}>‹ Voltar</Text>
        </TouchableOpacity>

        <View style={s.detailImage}>
          <Text style={{ fontSize: 100 }}>
            {product.emoji}
          </Text>
        </View>

        <Text style={s.heading}>{product.name}</Text>
        <Text style={s.subtitle}>{product.description}</Text>

        <Text style={s.detailPrice}>
          {money(product.price)}
        </Text>

        <View style={s.quantityRow}>
          <Text style={s.bodyText}>Quantidade</Text>

          <View style={s.quantityControls}>
            <TouchableOpacity
              style={s.quantityButton}
              onPress={() =>
                setQuantity(Math.max(1, quantity - 1))
              }
            >
              <Text style={s.quantityText}>−</Text>
            </TouchableOpacity>

            <Text style={s.quantityNumber}>{quantity}</Text>

            <TouchableOpacity
              style={s.quantityButton}
              onPress={() => setQuantity(quantity + 1)}
            >
              <Text style={s.quantityText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Button
          title={`Adicionar ao carrinho • ${money(
            product.price * quantity
          )}`}
          onPress={() =>
            navigation.navigate('Carrinho', {
              newItem: {
                ...product,
                quantity,
                cartKey: product.id,
              },
            })
          }
        />

        <Button
          title="Continuar comprando"
          secondary
          onPress={() => navigation.goBack()}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

/* CARRINHO */
function CartScreen({ route, navigation }) {
  const { items, setItems } = useApp();
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(false);

  useEffect(() => {
    const incoming = route.params?.newItem;

    if (!incoming) return;

    setItems(oldItems => {
      const existing = oldItems.find(
        item => item.cartKey === incoming.cartKey
      );

      if (existing) {
        return oldItems.map(item =>
          item.cartKey === incoming.cartKey
            ? {
                ...item,
                quantity: item.quantity + incoming.quantity,
              }
            : item
        );
      }

      return [...oldItems, incoming];
    });

    navigation.setParams({ newItem: undefined });
  }, [route.params?.newItem, navigation]);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const total = discount ? subtotal * 0.9 : subtotal;

  const goToMenu = () => {
    navigation.navigate('Loja', {
      screen: 'Cardápio',
    });
  };

  const goHome = () => {
    navigation.navigate('Loja', {
      screen: 'Início',
    });
  };

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView
        contentContainerStyle={s.page}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.topBar}>
          <View style={{ flex: 1 }}>
            <Heading
              title="Meu carrinho"
              subtitle="Confira os itens do seu pedido."
            />
          </View>

          <View style={s.cartButton}>
            <Text style={s.cartIcon}>🛒</Text>
          </View>
        </View>

        {items.length === 0 ? (
          <View style={s.emptyBox}>
            <View style={s.emptyCartCircle}>
              <Text style={s.emptyCartEmoji}>🛒</Text>
            </View>

            <Text style={s.emptyTitle}>
              Seu carrinho está vazio!
            </Text>

            <Text style={[s.subtitle, { textAlign: 'center' }]}>
              Você ainda não adicionou nenhum produto.
              Que tal escolher algo gostoso no nosso cardápio?
            </Text>

            <Button
              title="Voltar ao cardápio"
              onPress={goToMenu}
            />

            <Button
              title="Voltar para o início"
              secondary
              onPress={goHome}
            />

            <Text style={s.demoNote}>
              Seus produtos aparecerão aqui quando você
              adicioná-los ao carrinho.
            </Text>
          </View>
        ) : (
          <>
            {items.map(item => (
              <View
                key={item.cartKey}
                style={s.cartItem}
              >
                <View style={s.cartItemImage}>
                  <Text style={s.cartProductEmoji}>
                    {item.emoji}
                  </Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={s.productName}>
                    {item.name}
                  </Text>

                  <Text style={s.smallMuted}>
                    {item.quantity} × {money(item.price)}
                  </Text>

                  {!!item.flavor && (
                    <Text style={s.smallMuted}>
                      Sabor: {item.flavor} • Recipiente: {item.container}
                    </Text>
                  )}

                  {!!item.toppings?.length && (
                    <Text style={s.smallMuted}>
                      Adicionais: {item.toppings.join(', ')}
                    </Text>
                  )}

                  <Text style={s.price}>
                    {money(item.quantity * item.price)}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() =>
                    setItems(old =>
                      old.filter(
                        product => product.cartKey !== item.cartKey
                      )
                    )
                  }
                >
                  <Text style={s.removeText}>Remover</Text>
                </TouchableOpacity>
              </View>
            ))}

            <View style={s.couponRow}>
              <TextInput
                style={[s.search, s.couponInput]}
                placeholder="Cupom de desconto"
                placeholderTextColor={C.muted}
                value={coupon}
                onChangeText={setCoupon}
                autoCapitalize="characters"
              />

              <TouchableOpacity
                style={s.couponButton}
                onPress={() => {
                  if (coupon.trim().toUpperCase() === 'MACIA10') {
                    setDiscount(true);

                    Alert.alert(
                      'Cupom aplicado!',
                      'Você ganhou 10% de desconto.'
                    );
                  } else {
                    setDiscount(false);

                    Alert.alert(
                      'Cupom inválido',
                      'Experimente o cupom MACIA10.'
                    );
                  }
                }}
              >
                <Text style={s.couponButtonText}>Aplicar</Text>
              </TouchableOpacity>
            </View>

            <View style={s.summary}>
              <Summary
                label="Subtotal"
                value={money(subtotal)}
              />

              {discount && (
                <Summary
                  label="Desconto"
                  value={money(subtotal * 0.1)}
                />
              )}

              <Summary
                label="Total"
                value={money(total)}
                strong
              />
            </View>

            <Button
              title="Continuar pedido"
              onPress={() =>
                navigation.navigate('Checkout', {
                  items,
                  total,
                })
              }
            />

            <Button
              title="Continuar comprando"
              secondary
              onPress={goToMenu}
            />

            <Button
              title="Limpar carrinho"
              secondary
              onPress={() => {
                Alert.alert(
                  'Limpar carrinho',
                  'Deseja remover todos os produtos?',
                  [
                    { text: 'Cancelar', style: 'cancel' },
                    {
                      text: 'Limpar',
                      style: 'destructive',
                      onPress: () => {
                        setItems([]);
                        setDiscount(false);
                        setCoupon('');
                      },
                    },
                  ]
                );
              }}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Summary({ label, value, strong = false }) {
  return (
    <View style={s.summaryRow}>
      <Text
        style={[
          s.bodyText,
          strong && s.summaryStrong,
        ]}
      >
        {label}
      </Text>

      <Text
        style={[
          s.bodyText,
          strong && s.summaryStrong,
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

/* PERSONALIZAÇÃO */

function CustomScreen({ navigation }) {
  const [flavor, setFlavor] = useState('Morango');
  const [container, setContainer] = useState('Copo');
  const [toppings, setToppings] = useState([]);

  const flavors = [
    'Morango',
    'Chocolate',
    'Baunilha',
    'Napolitano',
  ];

  const extras = [
    'Granulado',
    'Calda de chocolate',
    'Morango',
    'Confetes',
  ];

  const price = 12 + toppings.length * 2;

  const toggleTopping = item => {
    setToppings(old =>
      old.includes(item)
        ? old.filter(value => value !== item)
        : [...old, item]
    );
  };

  const addCustomToCart = () => {
    const product = {
      id: `custom-${flavor}-${container}`,
      cartKey: `custom-${Date.now()}`,
      name: `${container} MACIA de ${flavor}`,
      description: toppings.length
        ? `Adicionais: ${toppings.join(', ')}`
        : 'Sem adicionais',
      flavor,
      container,
      toppings: [...toppings],
      isCustom: true,
      category: 'Personalizados',
      price,
      emoji: '🍨',
      quantity: 1,
    };

    navigation.navigate('Carrinho', {
      newItem: product,
    });
  };

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.page}>
        <Heading
          title="Monte seu sorvete"
          subtitle="Personalize cada detalhe!"
        />

        <Text style={s.sectionTitle}>1. Escolha o sabor</Text>

        {flavors.map(item => (
          <TouchableOpacity
            key={item}
            onPress={() => setFlavor(item)}
            style={[
              s.choice,
              flavor === item && s.choiceSelected,
            ]}
          >
            <Text style={s.bodyText}>{item}</Text>

            <Text style={s.choiceMark}>
              {flavor === item ? '✓' : '○'}
            </Text>
          </TouchableOpacity>
        ))}

        <Text style={[s.sectionTitle, s.sectionSpacing]}>
          2. Escolha o recipiente
        </Text>

        {['Copo', 'Casquinha', 'Pote'].map(item => (
          <TouchableOpacity
            key={item}
            onPress={() => setContainer(item)}
            style={[
              s.choice,
              container === item && s.choiceSelected,
            ]}
          >
            <Text style={s.bodyText}>{item}</Text>

            <Text style={s.choiceMark}>
              {container === item ? '✓' : '○'}
            </Text>
          </TouchableOpacity>
        ))}

        <Text style={[s.sectionTitle, s.sectionSpacing]}>
          3. Adicionais (+ R$ 2,00 cada)
        </Text>

        {extras.map(item => {
          const selected = toppings.includes(item);

          return (
            <TouchableOpacity
              key={item}
              onPress={() => toggleTopping(item)}
              style={[
                s.choice,
                selected && s.choiceSelected,
              ]}
            >
              <Text style={s.bodyText}>{item}</Text>

              <Text style={s.choiceMark}>
                {selected ? '✓' : '○'}
              </Text>
            </TouchableOpacity>
          );
        })}

        <View style={s.summary}>
          <Text style={s.productName}>
            {container} MACIA de {flavor}
          </Text>

          <Text style={s.detailPrice}>
            {money(price)}
          </Text>

          <Text style={s.smallMuted}>
            Adicionais: {toppings.join(', ') || 'Nenhum'}
          </Text>
        </View>

        <Button
          title="Adicionar ao carrinho"
          onPress={addCustomToCart}
        />

        <Button
          title="Ir para o carrinho"
          secondary
          onPress={() => {
            const draft = {
              id: `custom-${flavor}-${container}`,
              cartKey: `custom-draft-${Date.now()}`,
              name: `${container} MACIA de ${flavor}`,
              description: toppings.length
                ? `Adicionais: ${toppings.join(', ')}`
                : 'Sem adicionais',
              flavor,
              container,
              toppings: [...toppings],
              isCustom: true,
              category: 'Personalizados',
              price,
              emoji: '🍨',
              quantity: 1,
            };

            navigation.navigate('Carrinho', {
              newItem: draft,
            });
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

/* FINALIZAÇÃO DO PEDIDO */
function CheckoutScreen({ route, navigation }) {
  const { items, setItems, orders, setOrders } = useApp();

  const [delivery, setDelivery] = useState('Entrega');
  const [payment, setPayment] = useState('Pix');
  const [cep, setCep] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [endereco, setEndereco] = useState(null);
  const [consultando, setConsultando] = useState(false);
  const [erroCep, setErroCep] = useState('');

  const total = route.params?.total || 0;
  const itensPedido = route.params?.items || items;

  const consultarCep = async () => {
    const cepLimpo = cep.replace(/\D/g, '');

    if (cepLimpo.length !== 8) {
      setErroCep('Digite um CEP com 8 números.');
      setEndereco(null);
      return;
    }

    setConsultando(true);
    setErroCep('');
    setEndereco(null);

    try {
      const resposta = await fetch(
        `https://viacep.com.br/ws/${cepLimpo}/json/`
      );

      if (!resposta.ok) {
        throw new Error('Falha na consulta');
      }

      const dados = await resposta.json();

      if (dados.erro) {
        setErroCep(
          'CEP não encontrado. Confira os números e tente novamente.'
        );
        return;
      }

      setEndereco(dados);
    } catch (error) {
      setErroCep(
        'Não foi possível consultar o CEP. Verifique sua conexão e tente novamente.'
      );
    } finally {
      setConsultando(false);
    }
  };

  const enderecoFinal = endereco
    ? montarEnderecoCompleto({
        ...endereco,
        numero: numero.trim(),
        complemento: complemento.trim(),
      })
    : '';

  const confirmarPedido = () => {
    if (delivery === 'Entrega') {
      if (!endereco) {
        Alert.alert(
          'Consulte o CEP',
          'Informe e consulte um CEP válido antes de confirmar.'
        );
        return;
      }

      if (!numero.trim()) {
        Alert.alert(
          'Falta o número',
          'Informe o número do endereço.'
        );
        return;
      }
    }

    const novoPedido = {
      id: `MACIA-${Date.now()}`,
      date: new Date().toLocaleString('pt-BR'),
      items: itensPedido,
      total,
      delivery,
      payment,
      status: 'Em preparação',

      address:
        delivery === 'Entrega'
          ? enderecoFinal
          : 'Retirada na loja',

      addressData:
        delivery === 'Entrega'
          ? {
              ...endereco,
              numero: numero.trim(),
              complemento: complemento.trim(),
            }
          : null,
    };

    setOrders(old => [novoPedido, ...old]);
    setItems([]);

    navigation.navigate('Confirmacao', {
      ...novoPedido,
    });
  };

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView
        contentContainerStyle={s.page}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={s.link}>‹ Voltar ao carrinho</Text>
        </TouchableOpacity>

        <Heading
          title="Finalizar pedido"
          subtitle="Só mais alguns detalhes."
        />

        <Text style={s.sectionTitle}>
          Como você quer receber?
        </Text>

        {['Entrega', 'Retirada na loja'].map(item => (
          <TouchableOpacity
            key={item}
            onPress={() => setDelivery(item)}
            style={[
              s.choice,
              delivery === item && s.choiceSelected,
            ]}
          >
            <Text style={s.bodyText}>{item}</Text>

            <Text style={s.choiceMark}>
              {delivery === item ? '✓' : '○'}
            </Text>
          </TouchableOpacity>
        ))}

        {delivery === 'Entrega' && (
          <>
            <Text style={[s.sectionTitle, s.sectionSpacing]}>
              Endereço de entrega
            </Text>

            <Text style={s.fieldLabel}>CEP</Text>

            <TextInput
              style={s.search}
              placeholder="00000-000"
              placeholderTextColor={C.muted}
              value={cep}
              onChangeText={value => {
                setCep(
                  value.replace(/[^0-9-]/g, '').slice(0, 9)
                );
                setEndereco(null);
                setErroCep('');
              }}
              keyboardType="numeric"
              maxLength={9}
            />

            <Button
              title={
                consultando
                  ? 'Consultando CEP...'
                  : 'Buscar endereço pelo CEP'
              }
              secondary
              onPress={consultarCep}
            />

            {!!erroCep && (
              <Text style={s.errorText}>
                {erroCep}
              </Text>
            )}

            {endereco && (
              <View style={s.summary}>
                <Text style={s.infoTitle}>
                  Endereço localizado
                </Text>

                <Text style={s.bodyText}>
                  {endereco.logradouro ||
                    'Logradouro não informado pelo CEP'}
                </Text>

                <Text style={s.bodyText}>
                  {endereco.bairro ||
                    'Bairro não informado pelo CEP'}
                </Text>

                <Text style={s.bodyText}>
                  {endereco.localidade} - {endereco.uf}
                </Text>

                <Text style={s.smallMuted}>
                  CEP: {endereco.cep}
                </Text>
              </View>
            )}

            <Text style={s.fieldLabel}>Número</Text>

            <TextInput
              style={s.search}
              placeholder="Número da residência"
              placeholderTextColor={C.muted}
              value={numero}
              onChangeText={setNumero}
              keyboardType="numeric"
            />

            <Text style={s.fieldLabel}>
              Complemento (opcional)
            </Text>

            <TextInput
              style={s.search}
              placeholder="Casa, apartamento, referência..."
              placeholderTextColor={C.muted}
              value={complemento}
              onChangeText={setComplemento}
            />

            {!!endereco && (
              <>
                <Text style={s.smallMuted}>
                  Endereço completo: {enderecoFinal}
                </Text>

                <Button
                  title="Ver endereço no Google Maps"
                  secondary
                  onPress={() =>
                    abrirGoogleMaps(enderecoFinal, false)
                  }
                />
              </>
            )}
          </>
        )}

        <Text style={[s.sectionTitle, s.sectionSpacing]}>
          Forma de pagamento
        </Text>

        {[
          'Pix',
          'Cartão de crédito',
          'Cartão de débito',
          'Dinheiro',
        ].map(item => (
          <TouchableOpacity
            key={item}
            onPress={() => setPayment(item)}
            style={[
              s.choice,
              payment === item && s.choiceSelected,
            ]}
          >
            <Text style={s.bodyText}>{item}</Text>

            <Text style={s.choiceMark}>
              {payment === item ? '✓' : '○'}
            </Text>
          </TouchableOpacity>
        ))}

        <View style={s.summary}>
          <Summary
            label="Total dos produtos"
            value={money(total)}
            strong
          />

          <Summary
            label="Recebimento"
            value={delivery}
          />

          <Summary
            label="Pagamento"
            value={payment}
          />
        </View>

        <Button
          title="Confirmar pedido"
          onPress={confirmarPedido}
        />

        <Text style={s.demoNote}>
          Pedido e pagamento demonstrativos. Nenhuma cobrança
          será realizada.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

/* CONFIRMAÇÃO */

function ConfirmationScreen({ route, navigation }) {
  const pedido = route.params || {};

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView
        contentContainerStyle={[s.page, s.confirmPage]}
      >
        <View style={s.confirmIcon}>
          <Text style={{ fontSize: 52 }}>✓</Text>
        </View>

        <Text style={[s.heading, s.centerText]}>
          Pedido confirmado!
        </Text>

        <Text style={[s.subtitle, s.centerText]}>
          Tudo certo! Seu pedido foi registrado neste dispositivo.
        </Text>

        <View style={s.summary}>
          <Summary
            label="Número"
            value={pedido.id || '-'}
          />

          <Summary
            label="Total"
            value={money(pedido.total)}
            strong
          />

          <Summary
            label="Recebimento"
            value={pedido.delivery || '-'}
          />

          <Summary
            label="Pagamento"
            value={pedido.payment || '-'}
          />

          <Summary
            label="Status"
            value="Em preparação"
          />
        </View>

        {!!pedido.address && pedido.delivery === 'Entrega' && (
          <Text style={s.smallMuted}>
            Entrega em: {pedido.address}
          </Text>
        )}

        <Button
          title="Acompanhar pedido"
          onPress={() =>
            navigation.navigate('AcompanharPedido', {
              order: pedido,
            })
          }
        />

        <Button
          title="Voltar ao início"
          secondary
          onPress={() => navigation.popToTop()}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

/* PEDIDOS */

function OrdersScreen({ navigation }) {
  const { orders } = useApp();

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.page}>
        <Heading
          title="Meus pedidos"
          subtitle="Acompanhe suas compras."
        />

        {orders.length === 0 ? (
          <View style={s.emptyBox}>
            <Text style={{ fontSize: 54 }}>📦</Text>

            <Text style={s.sectionTitle}>
              Seus pedidos aparecerão aqui
            </Text>

            <Text style={[s.subtitle, s.centerText]}>
              Quando você confirmar uma compra, ela ficará salva nesta seção.
            </Text>
          </View>
        ) : (
          orders.map(order => (
            <View
              key={order.id}
              style={s.orderCard}
            >
              <View style={s.orderHeader}>
                <Text style={s.productName}>
                  {order.id}
                </Text>

                <Text style={s.statusText}>
                  {order.status || 'Recebido'}
                </Text>
              </View>

              <Text style={s.smallMuted}>
                {order.date}
              </Text>

              {(order.items || []).map((item, index) => (
                <Text
                  key={`${order.id}-${index}`}
                  style={s.bodyText}
                >
                  {item.quantity}x {item.name}
                </Text>
              ))}

              <Text style={s.price}>
                {money(order.total)}
              </Text>

              <Text style={s.smallMuted}>
                {order.delivery === 'Entrega'
                  ? order.address
                  : 'Retirada na loja'}
              </Text>

              <Button
                title="Acompanhar pedido"
                onPress={() =>
                  navigation.navigate('AcompanharPedido', {
                    order,
                  })
                }
              />

              {order.delivery === 'Entrega' && (
                <Button
                  title="Ver localização no Maps"
                  secondary
                  onPress={() =>
                    abrirGoogleMaps(order.address, false)
                  }
                />
              )}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ACOMPANHAMENTO */

function TrackingScreen({ route, navigation }) {
  const order = route.params?.order || {};

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.page}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={s.link}>‹ Voltar aos pedidos</Text>
        </TouchableOpacity>

        <Heading
          title="Acompanhar pedido"
          subtitle={order.id || 'Pedido MACIA'}
        />

        <View style={s.summary}>
          <Summary
            label="Status"
            value={order.status || 'Em preparação'}
            strong
          />

          <Summary
            label="Total"
            value={money(order.total)}
          />

          <Summary
            label="Pagamento"
            value={order.payment || '-'}
          />
        </View>

        <Text style={s.sectionTitle}>
          Endereço de entrega
        </Text>

        <Text style={s.bodyText}>
          {order.address || 'Retirada na loja'}
        </Text>

        {order.delivery === 'Entrega' && (
          <>
            <Button
              title="Abrir localização no Google Maps"
              onPress={() =>
                abrirGoogleMaps(order.address, false)
              }
            />

            <Button
              title="Abrir rota até o endereço"
              secondary
              onPress={() =>
                abrirGoogleMaps(order.address, true)
              }
            />
          </>
        )}

        <Text style={s.demoNote}>
          O mapa e a rota são abertos no Google Maps. O acompanhamento
          em tempo real do entregador depende de um aplicativo do
          entregador e de um servidor com compartilhamento de localização,
          recursos que ainda não fazem parte deste protótipo.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

/* CLUBE MACIA */
function ClubScreen({ navigation }) {
  const [selected, setSelected] = useState(null);

  const clubOptions = [
    {
      id: 'pontos',
      emoji: '⭐',
      title: 'Pontos demonstrativos',
      description: 'Imagine acumular pontos a cada pedido.',
      detail: 'No Clube MACIA, cada compra poderá gerar pontos para trocar por vantagens e produtos. Esta função é demonstrativa neste protótipo.',
    },
    {
      id: 'ofertas',
      emoji: '🎁',
      title: 'Ofertas especiais',
      description: 'Benefícios exclusivos para membros.',
      detail: 'Membros do Clube MACIA poderão acompanhar promoções, descontos e ofertas especiais. As ofertas exibidas nesta versão são ilustrativas.',
    },
    {
      id: 'vantagens',
      emoji: '💙',
      title: 'Vantagens do clube',
      description: 'Descubra benefícios pensados para você.',
      detail: 'O clube foi pensado para deixar cada visita à MACIA ainda mais especial, reunindo novidades e benefícios em um só lugar.',
    },
  ];

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.page}>
        <TouchableOpacity
          onPress={() =>
            selected
              ? setSelected(null)
              : navigation.goBack()
          }
          style={s.backButton}
          activeOpacity={0.75}
        >
          <Text style={s.link}>
            ‹ {selected ? 'Voltar ao Clube MACIA' : 'Voltar ao início'}
          </Text>
        </TouchableOpacity>

        <View style={s.clubBanner}>
          <Text style={{ fontSize: 48 }}>💙</Text>

          <Text style={[s.heading, { color: C.white }]}>
            {selected ? selected.title : 'Clube MACIA'}
          </Text>

          <Text
            style={[
              s.subtitle,
              { color: C.white, textAlign: 'center' },
            ]}
          >
            {selected
              ? 'Saiba mais sobre essa vantagem'
              : 'Mais sabor, mais vantagens!'}
          </Text>
        </View>

        {selected ? (
          <View style={s.infoBanner}>
            <Text style={{ fontSize: 30 }}>
              {selected.emoji}
            </Text>

            <View style={{ flex: 1 }}>
              <Text style={s.infoTitle}>
                {selected.title}
              </Text>

              <Text style={s.infoText}>
                {selected.detail}
              </Text>
            </View>
          </View>
        ) : (
          <>
            {clubOptions.map(option => (
              <TouchableOpacity
                key={option.id}
                style={s.infoBanner}
                activeOpacity={0.8}
                onPress={() => setSelected(option)}
              >
                <Text style={{ fontSize: 28 }}>
                  {option.emoji}
                </Text>

                <View style={{ flex: 1 }}>
                  <Text style={s.infoTitle}>
                    {option.title}
                  </Text>

                  <Text style={s.infoText}>
                    {option.description}
                  </Text>
                </View>

                <Text style={s.clubArrow}>›</Text>
              </TouchableOpacity>
            ))}

            <Text style={s.demoNote}>
              Clube ilustrativo. Cadastro, pontos e ofertas ainda
              não estão conectados a um sistema real.
            </Text>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/* PERFIL */

function ProfileScreen() {
  const { profile, setProfile } = useApp();
  const [draft, setDraft] = useState(profile);

  useEffect(() => {
    setDraft(profile);
  }, [profile]);

  const update = (field, value) => {
    setDraft(old => ({
      ...old,
      [field]: value,
    }));
  };

  const saveProfile = async () => {
    const cleaned = {
      name: draft.name.trim(),
      email: draft.email.trim(),
      phone: draft.phone.trim(),
      address: draft.address.trim(),
    };

    setProfile(cleaned);

    try {
      await AsyncStorage.setItem(
        'macia-zero-profile',
        JSON.stringify(cleaned)
      );

      Alert.alert(
        'Perfil atualizado!',
        'Suas informações foram salvas com sucesso neste dispositivo.'
      );
    } catch (error) {
      Alert.alert(
        'Perfil atualizado!',
        'As informações foram atualizadas durante esta sessão.'
      );
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView
        contentContainerStyle={s.page}
        keyboardShouldPersistTaps="handled"
      >
        <Heading
          title="Meu perfil"
          subtitle="Adicione ou atualize seus dados de cliente."
        />

        <View style={s.avatar}>
          <Text style={{ fontSize: 40 }}>👤</Text>
        </View>

        <Text style={s.fieldLabel}>Nome completo</Text>

        <TextInput
          style={s.search}
          value={draft.name}
          onChangeText={value => update('name', value)}
          placeholder="Digite seu nome"
          placeholderTextColor={C.muted}
        />

        <Text style={s.fieldLabel}>E-mail</Text>

        <TextInput
          style={s.search}
          value={draft.email}
          onChangeText={value => update('email', value)}
          placeholder="voce@email.com"
          placeholderTextColor={C.muted}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={s.fieldLabel}>Telefone</Text>

        <TextInput
          style={s.search}
          value={draft.phone}
          onChangeText={value => update('phone', value)}
          placeholder="(00) 00000-0000"
          placeholderTextColor={C.muted}
          keyboardType="phone-pad"
        />

        <Text style={s.fieldLabel}>Endereço</Text>

        <TextInput
          style={s.search}
          value={draft.address}
          onChangeText={value => update('address', value)}
          placeholder="Rua, número, bairro e cidade"
          placeholderTextColor={C.muted}
        />

        <Button
          title="Salvar alterações"
          onPress={saveProfile}
        />

        <Button
          title="Descartar alterações"
          secondary
          onPress={() => setDraft(profile)}
        />

        <Button
          title="Ajuda e atendimento"
          secondary
          onPress={() =>
            Alert.alert(
              'Atendimento MACIA',
              'Esta área será conectada futuramente.'
            )
          }
        />

        <Text style={s.demoNote}>
          Seus dados ficam salvos localmente neste dispositivo.
          Esta versão não possui cadastro online.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

/* NAVEGAÇÃO PRINCIPAL */

function TabsScreen() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: C.navy,
        tabBarInactiveTintColor: C.muted,
        tabBarStyle: {
          height: 65,
          paddingTop: 7,
          paddingBottom: 7,
          borderTopColor: C.border,
          backgroundColor: C.white,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="MACIA-Zero"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Início',
          tabBarIcon: () => (
            <Text style={s.tabIcon}>🏠</Text>
          ),
        }}
      />

      <Tab.Screen
        name="Cardápio"
        component={MenuScreen}
        options={{
          tabBarLabel: 'Cardápio',
          tabBarIcon: () => (
            <Text style={s.tabIcon}>🍨</Text>
          ),
        }}
      />

      <Tab.Screen
        name="Personalizar"
        component={CustomScreen}
        options={{
          tabBarLabel: 'Monte o seu',
          tabBarIcon: () => (
            <Text style={s.tabIcon}>✨</Text>
          ),
        }}
      />

      <Tab.Screen
        name="Pedidos"
        component={OrdersScreen}
        options={{
          tabBarLabel: 'Pedidos',
          tabBarIcon: () => (
            <Text style={s.tabIcon}>📦</Text>
          ),
        }}
      />

      <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: () => (
            <Text style={s.tabIcon}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

/* APLICATIVO */

export default function App() {
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);

  const [profile, setProfile] = useState({
    name: 'Cliente MACIA',
    email: '',
    phone: '',
    address: '',
  });

  const [ready, setReady] = useState(false);

  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const savedProfile = await AsyncStorage.getItem(
          'macia-zero-profile'
        );

        const savedCart = await AsyncStorage.getItem(
          'macia-zero-cart'
        );

        const savedOrders = await AsyncStorage.getItem(
          'macia-zero-orders'
        );

        if (savedProfile) {
          setProfile(JSON.parse(savedProfile));
        }

        if (savedCart) {
          setItems(JSON.parse(savedCart));
        }

        if (savedOrders) {
          setOrders(JSON.parse(savedOrders));
        }
      } catch (error) {
        console.log(
          'Não foi possível carregar os dados salvos.',
          error
        );
      } finally {
        setReady(true);
      }
    };

    loadSavedData();
  }, []);

  useEffect(() => {
    if (ready) {
      AsyncStorage.setItem(
        'macia-zero-cart',
        JSON.stringify(items)
      ).catch(() => {});

      AsyncStorage.setItem(
        'macia-zero-orders',
        JSON.stringify(orders)
      ).catch(() => {});
    }
  }, [items, orders, ready]);

  return (
    <AppContext.Provider
      value={{
        items,
        setItems,
        orders,
        setOrders,
        profile,
        setProfile,
      }}
    >
      <NavigationContainer>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={C.background}
        />

        <Stack.Navigator
          initialRouteName="Loja"
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: C.background,
            },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen
            name="Loja"
            component={TabsScreen}
          />

          <Stack.Screen
            name="Produto"
            component={ProductScreen}
          />

          <Stack.Screen
            name="Carrinho"
            component={CartScreen}
          />

          <Stack.Screen
            name="Checkout"
            component={CheckoutScreen}
          />

          <Stack.Screen
            name="AcompanharPedido"
            component={TrackingScreen}
          />

          <Stack.Screen
            name="Confirmacao"
            component={ConfirmationScreen}
          />

          <Stack.Screen
            name="Clube"
            component={ClubScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AppContext.Provider>
  );
}

/* ESTILOS RESPONSIVOS PARA MOBILE */
const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.background,
  },

  page: {
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
    flexGrow: 1,
  },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    gap: 12,
  },

  logoText: {
    color: C.navy,
    fontSize: 25,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  logoPink: {
    color: '#D85F9B',
  },

  smallMuted: {
    color: C.muted,
    fontSize: 12,
    marginTop: 3,
  },

  cartButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: C.palePink,
    borderWidth: 1,
    borderColor: '#F6D8E7',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cartIcon: {
    fontSize: 25,
  },

  banner: {
    backgroundColor: C.paleBlue,
    borderRadius: 24,
    padding: 20,
    marginBottom: 18,
    overflow: 'hidden',
  },

  bannerEyebrow: {
    color: C.blue,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 9,
  },

  bannerTitle: {
    color: C.navy,
    fontSize: 27,
    lineHeight: 34,
    fontWeight: '900',
    maxWidth: 300,
  },

  bannerText: {
    color: C.muted,
    fontSize: 14,
    marginTop: 8,
    marginBottom: 14,
  },

  bannerEmoji: {
    fontSize: 25,
    marginTop: 12,
  },

  button: {
    backgroundColor: C.navy,
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    minHeight: 48,
  },

  buttonSecondary: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.navy,
  },

  buttonText: {
    color: C.white,
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
  },

  buttonTextSecondary: {
    color: C.navy,
  },

  search: {
    backgroundColor: C.white,
    borderColor: C.border,
    borderWidth: 1,
    borderRadius: 14,
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: C.text,
    marginBottom: 18,
  },

  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  sectionTitle: {
    color: C.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 10,
  },

  sectionSpacing: {
    marginTop: 20,
  },

  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },

  productCard: {
    backgroundColor: C.white,
    borderRadius: 18,
    padding: 11,
    borderWidth: 1,
    borderColor: C.border,
    minHeight: 230,
  },

  productImage: {
    height: 105,
    backgroundColor: C.palePink,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  productEmoji: {
    fontSize: 43,
  },

  productName: {
    color: C.text,
    fontWeight: '800',
    fontSize: 14,
    lineHeight: 19,
  },

  productDescription: {
    color: C.muted,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 5,
    minHeight: 32,
  },

  productBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },

  price: {
    color: C.navy,
    fontWeight: '900',
    fontSize: 14,
  },

  plus: {
    backgroundColor: C.navy,
    width: 29,
    height: 29,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  plusText: {
    color: C.white,
    fontSize: 22,
    lineHeight: 25,
  },

  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.white,
    borderRadius: 18,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: C.border,
    gap: 12,
  },

  infoEmoji: {
    fontSize: 30,
  },

  infoTitle: {
    color: C.text,
    fontWeight: '800',
    fontSize: 14,
  },

  infoText: {
    color: C.muted,
    fontSize: 12,
    marginTop: 4,
    lineHeight: 17,
  },

  headingBox: {
    marginBottom: 22,
    flex: 1,
  },

  heading: {
    color: C.navy,
    fontSize: 27,
    fontWeight: '900',
    lineHeight: 34,
  },

  subtitle: {
    color: C.muted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 5,
  },

  categoryScroll: {
    marginBottom: 18,
  },

  category: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.white,
    paddingVertical: 9,
    paddingHorizontal: 15,
    marginRight: 8,
  },

  categorySelected: {
    backgroundColor: C.navy,
    borderColor: C.navy,
  },

  categoryText: {
    color: C.text,
    fontSize: 12,
    fontWeight: '700',
  },

  categoryTextSelected: {
    color: C.white,
  },

  detailImage: {
    height: 230,
    borderRadius: 24,
    backgroundColor: C.palePink,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },

  detailPrice: {
    color: C.navy,
    fontSize: 25,
    fontWeight: '900',
    marginTop: 14,
    marginBottom: 18,
  },

  quantityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },

  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },

  quantityButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: C.paleBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },

  quantityText: {
    color: C.navy,
    fontSize: 24,
    fontWeight: '700',
  },

  quantityNumber: {
    color: C.text,
    fontSize: 17,
    fontWeight: '800',
  },

  bodyText: {
    color: C.text,
    fontSize: 14,
    lineHeight: 21,
  },

  choice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 14,
    padding: 15,
    marginBottom: 9,
  },

  choiceSelected: {
    backgroundColor: C.paleBlue,
    borderColor: C.blue,
  },

  choiceMark: {
    color: C.navy,
    fontSize: 20,
    fontWeight: '800',
  },

  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    padding: 12,
    marginBottom: 10,
    gap: 12,
  },

  cartItemImage: {
    width: 58,
    height: 58,
    borderRadius: 14,
    backgroundColor: C.palePink,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cartProductEmoji: {
    fontSize: 32,
  },

  removeText: {
    color: '#C94B6A',
    fontSize: 11,
    fontWeight: '700',
  },

  couponRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginTop: 14,
  },

  couponInput: {
    flex: 1,
    marginBottom: 0,
    minWidth: 0,
  },

  couponButton: {
    backgroundColor: C.navy,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 15,
  },

  couponButtonText: {
    color: C.white,
    fontWeight: '800',
  },

  summary: {
    backgroundColor: C.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    padding: 16,
    marginVertical: 18,
    gap: 12,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },

  summaryStrong: {
    fontWeight: '800',
    color: C.navy,
  },

  emptyBox: {
    backgroundColor: C.white,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: C.border,
    padding: 22,
    alignItems: 'stretch',
    marginTop: 12,
  },

  emptyCartCircle: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: C.palePink,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 22,
  },

  emptyCartEmoji: {
    fontSize: 54,
  },

  emptyTitle: {
    color: C.navy,
    fontSize: 21,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
  },

  emptyText: {
    color: C.muted,
    textAlign: 'center',
    marginVertical: 25,
  },

  demoNote: {
    color: C.muted,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 17,
  },

  link: {
    color: C.blue,
    fontWeight: '800',
    fontSize: 15,
    marginBottom: 18,
  },

  confirmIcon: {
    width: 95,
    height: 95,
    borderRadius: 48,
    backgroundColor: '#DFF6E9',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 25,
  },

  confirmPage: {
    flex: 1,
    justifyContent: 'center',
  },

  centerText: {
    textAlign: 'center',
  },

  clubBanner: {
    backgroundColor: C.navy,
    borderRadius: 24,
    padding: 25,
    alignItems: 'center',
    marginBottom: 16,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: C.palePink,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 22,
  },

  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    marginBottom: 8,
  },

  clubArrow: {
    color: C.navy,
    fontSize: 30,
    fontWeight: '700',
    marginLeft: 4,
  },

  fieldLabel: {
    color: C.text,
    fontWeight: '700',
    fontSize: 13,
    marginBottom: 8,
  },

  tabIcon: {
    fontSize: 19,
  },

  errorText: {
    color: '#C0392B',
    fontSize: 13,
    marginTop: 5,
    marginBottom: 8,
  },

  orderCard: {
    backgroundColor: C.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    padding: 14,
    marginBottom: 14,
    gap: 8,
  },

  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },

  statusText: {
    color: C.green,
    fontSize: 12,
    fontWeight: '700',
  },
});