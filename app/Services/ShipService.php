<?php

namespace App\Services;

use App\Models\ShipClass;

class ShipService
{
    public function createShipClass(string $name, int $sort)
    {
        $shipClass = new ShipClass;
        $shipClass->name = $name;
        $shipClass->sort = $sort;
        $shipClass->save();

        $this->insertShipInOrder($shipClass);

        return $shipClass;
    }

    public function insertShipInOrder(ShipClass $shipClass)
    {
        $shipClasses = ShipClass::where('sort', '>=', $shipClass->sort)->where('id_class', '!=', $shipClass->id_class)->orderBy('sort', 'asc')->get();
        foreach ($shipClasses as $shipClass) {
            $shipClass->sort++;
            $shipClass->save();
        }
    }

    public function removeFromShipOrder(ShipClass $shipClass)
    {
        $shipClasses = ShipClass::where('sort', '>', $shipClass->sort)->orderBy('sort', 'asc')->get();
        foreach ($shipClasses as $shipClass) {
            $shipClass->sort--;
            $shipClass->save();
        }
    }

    public function updateShipClass(int $id_class, string $name, int $sort)
    {
        $shipClass = ShipClass::find($id_class);

        if (!$shipClass) {
            return [false, 'Ship class not found'];
        }

        if (!$shipClass->validateName($name)) {
            return [false, 'Name already exists'];
        }

        $shouldResort = $shipClass->sort !== $sort;

        $shipClass->name = $name;
        $shipClass->sort = $sort;

        $shipClass->save();

        if ($shouldResort) {
            $this->insertShipInOrder($shipClass);
        }

        return [true, $shipClass];
    }

    public function deleteShipClass(int $id_class)
    {
        $shipClass = ShipClass::find($id_class);

        if (!$shipClass) {
            return [false, 'Ship class not found'];
        }

        $shipClass->delete();

        $this->removeFromShipOrder($shipClass);

        return [true, 'Ship class deleted'];
    }
}
