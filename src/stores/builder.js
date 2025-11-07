import { defineStore } from "pinia";

export const  useBuilderStore = defineStore("builder", {
  state: () => ({
    elements: [],
    selectedElementId: null,
    selectedColumnFieldInfo: null, // { colIndex, fieldId, parentId }
  }),

  getters: {
    selectedElement(state) {
      return state.elements.find((el) => el.id === state.selectedElementId);
    },
  },

  actions: {
    generateId() {
      return Date.now().toString();
    },

    addElement(element) {
      const id = this.generateId();
      if (element.type === "columnControl") {
        const columnCount = element.columnCount || 2;
        const columns = Array.from({ length: columnCount }, () => []);
        const columnSizes = Array(columnCount).fill(
          Math.floor(12 / columnCount)
        );
        this.elements.push({ ...element, id, columns, columnSizes });
      } else {
        this.elements.push({ ...element, id });
      }
    },
    addElementToColumn(parentId, columnIndex, element) {
      const parent = this.elements.find((e) => e.id === parentId);
      if (!parent || parent.type !== "columnControl") return;

      parent.columns[columnIndex].push({
        ...element,
        id: this.generateId(),
      });
    },

    selectElement(id) {
      this.selectedElementId = id;
      this.selectedColumnFieldInfo = null;
    },

    selectColumnField(parentId, colIndex, fieldId) {
      this.selectedElementId = parentId;
      this.selectedColumnFieldInfo = { colIndex, fieldId, parentId };
    },

    updateSelectedProperty(key, value) {
      // Untuk element biasa (di root)
      if (this.selectedElement && !this.selectedColumnFieldInfo) {
        this.selectedElement[key] = value;
      }
    },

    updateSelectedColumnFieldProperty(key, value) {
      // Untuk element di dalam columnControl
      if (!this.selectedElement || !this.selectedColumnFieldInfo) return;

      const { colIndex, fieldId } = this.selectedColumnFieldInfo;
      const field = this.selectedElement.columns?.[colIndex]?.find(
        (f) => f.id === fieldId
      );
      if (field) {
        field[key] = value;
      }
    },

    deleteSelectedElement() {
      const index = this.elements.findIndex(
        (el) => el.id === this.selectedElementId
      );
      if (index !== -1) {
        this.elements.splice(index, 1);
        this.selectedElementId = null;
        this.selectedColumnFieldInfo = null;
      }
    },

    isNameUnique(name, ignoreId = null) {
      const checkElements = (list) => {
        for (const el of list) {
          if (el.name === name && el.id !== ignoreId) return false;
          if (el.type === "columnControl") {
            for (const col of el.columns) {
              if (!checkElements(col)) return false;
            }
          }
        }
        return true;
      };

      return checkElements(this.elements);
    },
  },
});
