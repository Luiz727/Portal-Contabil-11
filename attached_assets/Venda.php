<?php

class Venda extends TRecord
{
    const TABLENAME  = 'venda';
    const PRIMARYKEY = 'venda_id';
    const IDPOLICY   =  'serial'; // {max, serial}

    private Cliente $cliente;

    

    /**
     * Constructor method
     */
    public function __construct($id = NULL, $callObjectLoad = TRUE)
    {
        parent::__construct($id, $callObjectLoad);
        parent::addAttribute('cliente_id');
        parent::addAttribute('data_venda');
        parent::addAttribute('meio_pagamento');
        parent::addAttribute('total_venda');
            
    }

    /**
     * Method set_cliente
     * Sample of usage: $var->cliente = $object;
     * @param $object Instance of Cliente
     */
    public function set_cliente(Cliente $object)
    {
        $this->cliente = $object;
        $this->cliente_id = $object->cliente_id;
    }

    /**
     * Method get_cliente
     * Sample of usage: $var->cliente->attribute;
     * @returns Cliente instance
     */
    public function get_cliente()
    {
    
        // loads the associated object
        if (empty($this->cliente))
            $this->cliente = new Cliente($this->cliente_id);
    
        // returns the associated object
        return $this->cliente;
    }

    /**
     * Method getVendaItems
     */
    public function getVendaItems()
    {
        $criteria = new TCriteria;
        $criteria->add(new TFilter('venda_id', '=', $this->venda_id));
        return VendaItem::getObjects( $criteria );
    }

    public function set_venda_item_produto_to_string($venda_item_produto_to_string)
    {
        if(is_array($venda_item_produto_to_string))
        {
            $values = Produto::where('produto_id', 'in', $venda_item_produto_to_string)->getIndexedArray('descricao', 'descricao');
            $this->venda_item_produto_to_string = implode(', ', $values);
        }
        else
        {
            $this->venda_item_produto_to_string = $venda_item_produto_to_string;
        }

        $this->vdata['venda_item_produto_to_string'] = $this->venda_item_produto_to_string;
    }

    public function get_venda_item_produto_to_string()
    {
        if(!empty($this->venda_item_produto_to_string))
        {
            return $this->venda_item_produto_to_string;
        }
    
        $values = VendaItem::where('venda_id', '=', $this->venda_id)->getIndexedArray('produto_id','{produto->descricao}');
        return implode(', ', $values);
    }

    public function set_venda_item_venda_to_string($venda_item_venda_to_string)
    {
        if(is_array($venda_item_venda_to_string))
        {
            $values = Venda::where('venda_id', 'in', $venda_item_venda_to_string)->getIndexedArray('venda_id', 'venda_id');
            $this->venda_item_venda_to_string = implode(', ', $values);
        }
        else
        {
            $this->venda_item_venda_to_string = $venda_item_venda_to_string;
        }

        $this->vdata['venda_item_venda_to_string'] = $this->venda_item_venda_to_string;
    }

    public function get_venda_item_venda_to_string()
    {
        if(!empty($this->venda_item_venda_to_string))
        {
            return $this->venda_item_venda_to_string;
        }
    
        $values = VendaItem::where('venda_id', '=', $this->venda_id)->getIndexedArray('venda_id','{venda->venda_id}');
        return implode(', ', $values);
    }

    
}

