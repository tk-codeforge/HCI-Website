"use client";
import React from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import {
    CITY_SECTIONS,
    DEFAULT_SECTION_ORDER,
    DEFAULT_SECTION_ORDER_STATE,
    normalizeOrder,
} from "@/utils/citySections";

// Re-exported so the admin page can import everything from one place.
export { CITY_SECTIONS, DEFAULT_SECTION_ORDER, DEFAULT_SECTION_ORDER_STATE, normalizeOrder };

const LABELS = Object.fromEntries(CITY_SECTIONS.map((s) => [s.key, s.label]));
const COLUMN = Object.fromEntries(CITY_SECTIONS.map((s) => [s.key, s.column]));

const Row = ({ id, index, total, onMove }) => {
    const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } =
        useSortable({ id });

    return (
        <li
            ref={setNodeRef}
            className="list-group-item d-flex align-items-center gap-2 py-2"
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
                opacity: isDragging ? 0.6 : 1,
                background: isDragging ? "#fff7f0" : undefined,
                zIndex: isDragging ? 2 : "auto",
                position: "relative",
            }}
        >
            <button
                type="button"
                ref={setActivatorNodeRef}
                {...attributes}
                {...listeners}
                className="btn btn-sm btn-light border"
                style={{ cursor: "grab", touchAction: "none" }}
                aria-label={`Drag ${LABELS[id]}`}
                title="Drag to reorder"
            >
                ⠿
            </button>
            <span className="badge bg-secondary">{index + 1}</span>
            <span className="flex-grow-1">{LABELS[id]}</span>
            <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                disabled={index === 0}
                onClick={() => onMove(index, index - 1)}
                aria-label={`Move ${LABELS[id]} up`}
            >
                ↑
            </button>
            <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                disabled={index === total - 1}
                onClick={() => onMove(index, index + 1)}
                aria-label={`Move ${LABELS[id]} down`}
            >
                ↓
            </button>
        </li>
    );
};

const SortableList = ({ title, items, onChange }) => {
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const move = (from, to) => onChange(arrayMove(items, from, to));

    const handleDragEnd = ({ active, over }) => {
        if (!over || active.id === over.id) return;
        move(items.indexOf(active.id), items.indexOf(over.id));
    };

    return (
        <div>
            <h6 className="mb-2">{title}</h6>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={items} strategy={verticalListSortingStrategy}>
                    <ul className="list-group">
                        {items.map((id, index) => (
                            <Row key={id} id={id} index={index} total={items.length} onMove={move} />
                        ))}
                    </ul>
                </SortableContext>
            </DndContext>
        </div>
    );
};

/**
 * value:    { desktop: string[], mobile: string[] }
 * onChange: (nextValue) => void
 */
const SectionOrderManager = ({ value, onChange }) => {
    const desktop = normalizeOrder(value?.desktop);
    const mobile = normalizeOrder(value?.mobile);

    const dMain = desktop.filter((key) => COLUMN[key] === "main");
    const dSide = desktop.filter((key) => COLUMN[key] === "sidebar");
    // On desktop "Nearby Cities" is always the full-width strip at the bottom.
    const setDesktop = (main, side) => onChange({ desktop: [...main, ...side, "nearbyCities"], mobile });

    return (
        <div>
            <p className="text-muted small mb-2">
                Drag the handle (or use the arrows) to reorder. Desktop and mobile are saved separately. The hero
                banner always stays on top.
            </p>
            <div className="d-flex flex-wrap gap-2 mb-3">
                <button
                    type="button"
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => onChange({ desktop, mobile: [...dMain, ...dSide, "nearbyCities"] })}
                >
                    Copy desktop order to mobile
                </button>
                <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => onChange(DEFAULT_SECTION_ORDER_STATE)}
                >
                    Reset both to default
                </button>
            </div>
            <div className="row g-4">
                <div className="col-lg-6">
                    <h6 className="mb-1">🖥 Desktop (screens ≥ 992px)</h6>
                    <p className="text-muted small mb-2">Two columns: the main column and the sticky sidebar are ordered separately. Nearby Cities stays at the bottom.</p>
                    <SortableList title="Main column" items={dMain} onChange={(next) => setDesktop(next, dSide)} />
                    <div className="mt-3" />
                    <SortableList title="Sidebar" items={dSide} onChange={(next) => setDesktop(dMain, next)} />
                </div>
                <div className="col-lg-6">
                    <h6 className="mb-1">📱 Mobile &amp; tablet (screens &lt; 992px)</h6>
                    <p className="text-muted small mb-2">Everything stacks in one column, so any section can go anywhere.</p>
                    <SortableList title="Single column" items={mobile} onChange={(next) => onChange({ desktop, mobile: next })} />
                </div>
            </div>
        </div>
    );
};

export default SectionOrderManager;
