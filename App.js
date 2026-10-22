import React, { useEffect, useState } from 'react';
import {
  Alert,
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
  const [items, setItems] = useState([]);
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
      id: `custom-${flavor}-${container}-${toppings.join('-')}`,
      cartKey: `custom-${Date.now()}`,
      name: `${container} de ${flavor}`,
      description: toppings.length
        ? `Adicionais: ${toppings.join(', ')}`
        : 'Sorvete personalizado',
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
          onPress={() => navigation.navigate('Carrinho')}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

/* FINALIZAÇÃO DO PEDIDO */

function CheckoutScreen({ route, navigation }) {
  const [delivery, setDelivery] = useState('Entrega');
  const [address, setAddress] = useState('');
  const [payment, setPayment] = useState('Pix');

  const total = route.params?.total || 0;

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.page}>
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

            <TextInput
              style={s.search}
              placeholder="Rua, número, bairro..."
              placeholderTextColor={C.muted}
              value={address}
              onChangeText={setAddress}
            />
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

          <Summary label="Recebimento" value={delivery} />
          <Summary label="Pagamento" value={payment} />
        </View>

        <Button
          title="Confirmar pedido"
          onPress={() => {
            if (delivery === 'Entrega' && !address.trim()) {
              Alert.alert(
                'Falta o endereço',
                'Informe o endereço para entrega.'
              );
              return;
            }

            navigation.navigate('Confirmacao', {
              total,
              delivery,
              payment,
            });
          }}
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
  const { total, delivery, payment } = route.params || {};

  return (
    <SafeAreaView style={s.safe}>
      <View style={[s.page, s.confirmPage]}>
        <View style={s.confirmIcon}>
          <Text style={{ fontSize: 52 }}>✓</Text>
        </View>

        <Text style={[s.heading, s.centerText]}>
          Pedido confirmado!
        </Text>

        <Text style={[s.subtitle, s.centerText]}>
          Tudo certo! Este é um pedido de demonstração
          do MACIA Zero.
        </Text>

        <View style={s.summary}>
          <Summary
            label="Total"
            value={money(total)}
            strong
          />
          <Summary label="Recebimento" value={delivery} />
          <Summary label="Pagamento" value={payment} />
          <Summary label="Status" value="Em preparação" />
        </View>

        <Button
          title="Voltar ao início"
          onPress={() => navigation.popToTop()}
        />
      </View>
    </SafeAreaView>
  );
}

/* PEDIDOS */

function OrdersScreen() {
  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.page}>
        <Heading
          title="Meus pedidos"
          subtitle="Acompanhe suas compras."
        />

        <View style={s.emptyBox}>
          <Text style={{ fontSize: 54 }}>📦</Text>

          <Text style={s.sectionTitle}>
            Seus pedidos aparecerão aqui
          </Text>

          <Text style={[s.subtitle, s.centerText]}>
            Como este protótipo não usa backend, o histórico
            não fica salvo.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* CLUBE MACIA */

function ClubScreen() {
  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.page}>
        <View style={s.clubBanner}>
          <Text style={{ fontSize: 48 }}>💙</Text>

          <Text style={[s.heading, { color: C.white }]}>
            Clube MACIA
          </Text>

          <Text
            style={[
              s.subtitle,
              { color: C.white, textAlign: 'center' },
            ]}
          >
            Mais sabor, mais vantagens!
          </Text>
        </View>

        <View style={s.infoBanner}>
          <Text style={{ fontSize: 28 }}>⭐</Text>

          <View style={{ flex: 1 }}>
            <Text style={s.infoTitle}>
              Pontos demonstrativos
            </Text>
            <Text style={s.infoText}>
              Imagine acumular pontos a cada pedido.
            </Text>
          </View>
        </View>

        <View style={s.infoBanner}>
          <Text style={{ fontSize: 28 }}>🎁</Text>

          <View style={{ flex: 1 }}>
            <Text style={s.infoTitle}>
              Ofertas especiais
            </Text>
            <Text style={s.infoText}>
              Benefícios exclusivos para membros.
            </Text>
          </View>
        </View>

        <Text style={s.demoNote}>
          Clube ilustrativo, sem cadastro ou armazenamento.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

/* PERFIL */

function ProfileScreen() {
  const [name, setName] = useState('Cliente MACIA');
  const [email, setEmail] = useState('');

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.page}>
        <Heading
          title="Meu perfil"
          subtitle="Seus dados no protótipo."
        />

        <View style={s.avatar}>
          <Text style={{ fontSize: 40 }}>👤</Text>
        </View>

        <Text style={s.fieldLabel}>Nome</Text>

        <TextInput
          style={s.search}
          value={name}
          onChangeText={setName}
          placeholder="Seu nome"
          placeholderTextColor={C.muted}
        />

        <Text style={s.fieldLabel}>E-mail</Text>

        <TextInput
          style={s.search}
          value={email}
          onChangeText={setEmail}
          placeholder="voce@email.com"
          placeholderTextColor={C.muted}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Button
          title="Salvar alterações"
          onPress={() =>
            Alert.alert(
              'Perfil',
              'Dados atualizados apenas nesta demonstração.'
            )
          }
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
          tabBarIcon: () => <Text style={s.tabIcon}>🏠</Text>,
        }}
      />

      <Tab.Screen
        name="Cardápio"
        component={MenuScreen}
        options={{
          tabBarLabel: 'Cardápio',
          tabBarIcon: () => <Text style={s.tabIcon}>🍨</Text>,
        }}
      />

      <Tab.Screen
        name="Personalizar"
        component={CustomScreen}
        options={{
          tabBarLabel: 'Monte o seu',
          tabBarIcon: () => <Text style={s.tabIcon}>✨</Text>,
        }}
      />

      <Tab.Screen
        name="Pedidos"
        component={OrdersScreen}
        options={{
          tabBarLabel: 'Pedidos',
          tabBarIcon: () => <Text style={s.tabIcon}>📦</Text>,
        }}
      />

      <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: () => <Text style={s.tabIcon}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

/* APLICATIVO */

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={C.background}
      />

      <Stack.Navigator
        initialRouteName="Loja"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: C.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Loja" component={TabsScreen} />
        <Stack.Screen name="Produto" component={ProductScreen} />
        <Stack.Screen name="Carrinho" component={CartScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen
          name="Confirmacao"
          component={ConfirmationScreen}
        />
        <Stack.Screen name="Clube" component={ClubScreen} />
      </Stack.Navigator>
    </NavigationContainer>
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

  fieldLabel: {
    color: C.text,
    fontWeight: '700',
    fontSize: 13,
    marginBottom: 8,
  },

  tabIcon: {
    fontSize: 19,
  },
});