import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 11,
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 16,
  },
  heading: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: "bold",
  },
  text: {
    marginBottom: 4,
  },
});

function toText(value) {
  if (!value) return "";
  if (typeof value === "string") return value;

  if (Array.isArray(value)) {
    return value
      .map((block) => {
        if (!block?.children || !Array.isArray(block.children)) return "";
        return block.children
          .map((child) => (typeof child?.text === "string" ? child.text : ""))
          .join("")
          .trim();
      })
      .filter(Boolean)
      .join("\n\n");
  }

  if (value?.children && Array.isArray(value.children)) {
    return value.children
      .map((child) => (typeof child?.text === "string" ? child.text : ""))
      .join("")
      .trim();
  }

  return "";
}

export function RecipePDF({ recipe }) {
  const description = toText(recipe?.description);
  const prepTime = Number(recipe?.prepTime) || 0;
  const cookTime = Number(recipe?.cookTime) || 0;
  const ingredients = Array.isArray(recipe?.ingredients) ? recipe.ingredients : [];
  const instructions = Array.isArray(recipe?.instructions)
    ? recipe.instructions
    : [];
  const tips = Array.isArray(recipe?.tips) ? recipe.tips : [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{recipe?.title || "Recipe"}</Text>
        {!!description && <Text style={styles.text}>{description}</Text>}

        <View style={styles.section}>
          <Text>
            Cuisine: {recipe?.cuisine || "other"} | Category: {recipe?.category || "dinner"}
          </Text>
          <Text>Time: {prepTime + cookTime} mins</Text>
          <Text>Servings: {recipe?.servings || "-"}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Ingredients</Text>
          {ingredients.map((ing, i) => (
            <Text key={i} style={styles.text}>
              - {ing?.item || "Ingredient"} - {ing?.amount || "to taste"}
            </Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Instructions</Text>
          {instructions.map((step, i) => (
            <View key={step?.step ?? i} style={{ marginBottom: 6 }}>
              <Text>
                {step?.step ?? i + 1}. {step?.title || "Step"}
              </Text>
              <Text>{step?.instruction || ""}</Text>
            </View>
          ))}
        </View>

        {tips.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.heading}>Chef's Tips</Text>
            {tips.map((tip, i) => (
              <Text key={i}>- {toText(tip)}</Text>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}
